#!/usr/bin/env python3
"""
Health checks post-scrape.
Falla (exit 1) y alerta si:
  - una tienda devolvió 0 productos en la última corrida
  - productos de una tienda cayeron >50% vs la corrida anterior
  - la mediana de una medida cambió >50% vs el día anterior
"""

from __future__ import annotations

import json
import logging
import os
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent))

import psycopg

from base import database_url, load_env
from stores import ACTIVE_STORE_SLUGS

log = logging.getLogger("scrapers.health")

DROP_RATIO = 0.5
MEDIAN_CHANGE_RATIO = 0.5


@dataclass
class Finding:
    code: str
    message: str


def _latest_runs(cur) -> list[tuple]:
    """Última y penúltima corrida ok/error por tienda."""
    cur.execute(
        """
        WITH ranked AS (
          SELECT
            sr.id,
            sr.store_id,
            s.slug,
            sr.productos,
            sr.estado,
            sr.started_at,
            ROW_NUMBER() OVER (
              PARTITION BY sr.store_id ORDER BY sr.started_at DESC, sr.id DESC
            ) AS rn
          FROM scrape_runs sr
          JOIN stores s ON s.id = sr.store_id
          WHERE s.activo = TRUE
        )
        SELECT store_id, slug, id, productos, estado, started_at, rn
        FROM ranked
        WHERE rn <= 2
        ORDER BY slug, rn
        """
    )
    return cur.fetchall()


def check_store_runs(cur) -> list[Finding]:
    findings: list[Finding] = []
    rows = _latest_runs(cur)
    by_store: dict[str, list[tuple]] = {}
    for store_id, slug, run_id, productos, estado, started_at, rn in rows:
        by_store.setdefault(slug, []).append(
            (rn, productos, estado, run_id, started_at)
        )

    # Solo tiendas del cron (ACTIVE_STORE_SLUGS). ML no entra hasta tener OAuth.
    for slug in ACTIVE_STORE_SLUGS:
        runs = by_store.get(slug, [])
        if not runs:
            findings.append(
                Finding(
                    "no_runs",
                    f"[{slug}] sin scrape_runs — 0 productos implícito",
                )
            )
            continue
        latest = next(r for r in runs if r[0] == 1)
        _, productos, estado, run_id, _ = latest
        if productos == 0 or estado == "error":
            findings.append(
                Finding(
                    "zero_products",
                    f"[{slug}] última corrida #{run_id} → {productos} productos (estado={estado})",
                )
            )
        prev = next((r for r in runs if r[0] == 2), None)
        if prev and prev[1] > 0:
            prev_n = prev[1]
            if productos < prev_n * (1 - DROP_RATIO):
                drop_pct = 100 * (1 - productos / prev_n)
                findings.append(
                    Finding(
                        "drop_50",
                        f"[{slug}] productos {prev_n} → {productos} (−{drop_pct:.0f}% vs corrida anterior)",
                    )
                )
    return findings


def check_median_swings(cur) -> list[Finding]:
    findings: list[Finding] = []
    cur.execute(
        """
        WITH today AS (
          SELECT size_id, mediana
          FROM size_daily_stats
          WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date
        ),
        yesterday AS (
          SELECT size_id, mediana
          FROM size_daily_stats
          WHERE dia = (now() AT TIME ZONE 'America/Argentina/Buenos_Aires')::date - 1
        )
        SELECT
          s.slug,
          t.mediana AS mediana_hoy,
          y.mediana AS mediana_ayer
        FROM today t
        JOIN yesterday y ON y.size_id = t.size_id
        JOIN sizes s ON s.id = t.size_id
        WHERE y.mediana > 0
          AND abs(t.mediana - y.mediana)::float / y.mediana > %s
        ORDER BY s.slug
        """,
        (MEDIAN_CHANGE_RATIO,),
    )
    for slug, hoy, ayer in cur.fetchall():
        change = 100 * (hoy - ayer) / ayer
        findings.append(
            Finding(
                "median_swing",
                f"[{slug}] mediana ${ayer:,} → ${hoy:,} ({change:+.0f}% en 1 día)",
            )
        )
    return findings


def notify_webhook(findings: list[Finding]) -> None:
    url = os.environ.get("ALERT_WEBHOOK", "").strip()
    if not url or not findings:
        return
    body = {
        "text": "CubiertasHoy scrape health FAIL\n"
        + "\n".join(f"• {f.message}" for f in findings),
        "findings": [{"code": f.code, "message": f.message} for f in findings],
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "cubiertashoy-health/0.1"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            log.info("webhook status %s", getattr(resp, "status", "?"))
    except urllib.error.URLError as exc:
        log.warning("webhook falló: %s", exc)


def create_github_issue(findings: list[Finding]) -> None:
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    repo = os.environ.get("GITHUB_REPOSITORY", "").strip()
    if not token or not repo or not findings:
        return
    title = f"[scrape-health] {len(findings)} alerta(s) — {findings[0].code}"
    body = "## Health check falló\n\n" + "\n".join(
        f"- `{f.code}`: {f.message}" for f in findings
    )
    run_url = os.environ.get("GITHUB_SERVER_URL", "https://github.com")
    run_id = os.environ.get("GITHUB_RUN_ID")
    if run_id:
        body += f"\n\n[Ver workflow run]({run_url}/{repo}/actions/runs/{run_id})"
    payload = json.dumps(
        {"title": title[:200], "body": body, "labels": ["scrape-health"]}
    ).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/issues",
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "cubiertashoy-health/0.1",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode("utf-8")
            issue = json.loads(raw)
            log.info("issue creada: %s", issue.get("html_url"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        # Label puede no existir — reintentar sin labels
        if exc.code == 422 and "label" in detail.lower():
            payload2 = json.dumps({"title": title[:200], "body": body}).encode("utf-8")
            req2 = urllib.request.Request(
                f"https://api.github.com/repos/{repo}/issues",
                data=payload2,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                    "User-Agent": "cubiertashoy-health/0.1",
                },
                method="POST",
            )
            try:
                with urllib.request.urlopen(req2, timeout=20) as resp:
                    issue = json.loads(resp.read().decode("utf-8"))
                    log.info("issue creada (sin label): %s", issue.get("html_url"))
                    return
            except urllib.error.URLError as exc2:
                log.warning("issue falló (retry): %s", exc2)
                return
        log.warning("issue falló HTTP %s: %s", exc.code, detail[:300])
    except urllib.error.URLError as exc:
        log.warning("issue falló: %s", exc)


def run_checks() -> list[Finding]:
    load_env()
    findings: list[Finding] = []
    with psycopg.connect(database_url()) as conn:
        with conn.cursor() as cur:
            findings.extend(check_store_runs(cur))
            findings.extend(check_median_swings(cur))
    return findings


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    # Modo test: fuerza un finding para probar alertas
    if "--force-fail" in sys.argv:
        findings = [
            Finding(
                "forced",
                "[test] fallo forzado para probar webhook / issue",
            )
        ]
    else:
        findings = run_checks()

    if not findings:
        log.info("health OK")
        return 0

    for f in findings:
        log.error("%s: %s", f.code, f.message)
    notify_webhook(findings)
    create_github_issue(findings)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
