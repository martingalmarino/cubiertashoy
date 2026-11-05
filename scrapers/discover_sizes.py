#!/usr/bin/env python3
"""Descubre (ancho, perfil, rodado) reales desde catálogos de tiendas (sin filtrar por seed)."""

from __future__ import annotations

import json
import logging
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from parser import parse_titulo  # noqa: E402

UA = "cubiertashoy-discover/0.1 (+https://cubiertashoy.com)"
log = logging.getLogger("discover_sizes")


def _get_json(url: str, timeout: int = 40) -> tuple[any, dict[str, str]]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        headers = {k.lower(): v for k, v in resp.headers.items()}
        data = json.loads(resp.read().decode("utf-8", errors="replace"))
        return data, headers


def discover_360() -> dict[str, int]:
    counts: dict[str, int] = defaultdict(int)
    page = 1
    total_pages = 1
    while page <= total_pages:
        url = (
            "https://360neumaticos.com.ar/wp-json/wc/store/products"
            f"?category=38&per_page=100&page={page}"
        )
        try:
            data, headers = _get_json(url)
        except Exception as exc:  # noqa: BLE001
            log.warning("360 page %s: %s", page, exc)
            break
        if page == 1:
            tp = headers.get("x-wp-totalpages")
            if tp and tp.isdigit():
                total_pages = max(1, int(tp))
            log.info("360 pages=%s", total_pages)
        if not isinstance(data, list) or not data:
            break
        for product in data:
            if not product.get("is_in_stock", True):
                continue
            parsed = parse_titulo(product.get("name") or "")
            if not parsed:
                continue
            slug = f"{parsed.ancho}-{parsed.perfil}-r{parsed.rodado}"
            counts[slug] += 1
        if len(data) < 100 and page >= total_pages:
            break
        page += 1
        time.sleep(2.2)
        if page > 50:
            break
    return counts


def discover_neumaflores() -> dict[str, int]:
    counts: dict[str, int] = defaultdict(int)
    page = 1
    while page <= 80:
        url = (
            "https://www.neumaflores.com.ar/collections/neumaticos-auto/products.json"
            f"?limit=50&page={page}"
        )
        try:
            data, _ = _get_json(url)
        except Exception as exc:  # noqa: BLE001
            log.warning("nf page %s: %s", page, exc)
            break
        products = (data or {}).get("products") if isinstance(data, dict) else None
        if not products:
            break
        for product in products:
            variants = product.get("variants") or []
            available = any(v.get("available") for v in variants) if variants else True
            if not available:
                continue
            parsed = parse_titulo(product.get("title") or "")
            if not parsed:
                continue
            slug = f"{parsed.ancho}-{parsed.perfil}-r{parsed.rodado}"
            counts[slug] += 1
        if len(products) < 50:
            break
        page += 1
        time.sleep(2.2)
    return counts


def discover_vtex(base: str, anchos: list[int]) -> dict[str, int]:
    """Búsqueda amplia por ancho (ft=175, ft=185…) sin filtrar al seed."""
    counts: dict[str, int] = defaultdict(int)
    for ancho in anchos:
        offset = 0
        while offset < 500:
            url = (
                f"{base.rstrip('/')}/api/catalog_system/pub/products/search"
                f"?ft={ancho}&_from={offset}&_to={offset + 49}"
            )
            try:
                data, _ = _get_json(url)
            except urllib.error.HTTPError as exc:
                log.warning("vtex %s ft=%s offset=%s: %s", base, ancho, offset, exc)
                break
            except Exception as exc:  # noqa: BLE001
                log.warning("vtex %s: %s", base, exc)
                break
            if not isinstance(data, list) or not data:
                break
            for product in data:
                titulo = product.get("productName") or product.get("productTitle") or ""
                items = product.get("items") or []
                qty = 0
                if items:
                    sellers = (items[0].get("sellers") or [])
                    if sellers:
                        qty = (sellers[0].get("commertialOffer") or {}).get(
                            "AvailableQuantity"
                        ) or 0
                if qty is not None and int(qty) <= 0:
                    continue
                parsed = parse_titulo(titulo)
                if not parsed or parsed.ancho != ancho:
                    continue
                slug = f"{parsed.ancho}-{parsed.perfil}-r{parsed.rodado}"
                counts[slug] += 1
            if len(data) < 50:
                break
            offset += 50
            time.sleep(2.2)
        time.sleep(2.2)
    return counts


def merge_counts(*maps: dict[str, int]) -> dict[str, int]:
    out: dict[str, int] = defaultdict(int)
    for m in maps:
        for k, v in m.items():
            out[k] += v
    return dict(out)


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    anchos = [145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285]

    log.info("descubriendo 360…")
    c360 = discover_360()
    log.info("360 → %s medidas", len(c360))

    log.info("descubriendo neumaflores…")
    cnf = discover_neumaflores()
    log.info("nf → %s medidas", len(cnf))

    log.info("descubriendo norauto…")
    cnor = discover_vtex("https://www.norauto.com.ar", anchos)
    log.info("norauto → %s medidas", len(cnor))

    log.info("descubriendo naldo…")
    cnal = discover_vtex("https://www.naldo.com.ar", anchos)
    log.info("naldo → %s medidas", len(cnal))

    merged = merge_counts(c360, cnf, cnor, cnal)
    rows = []
    for slug, n in sorted(merged.items()):
        ancho, perfil, rpart = slug.split("-")
        rodado = int(rpart[1:])
        rows.append(
            {
                "slug": slug,
                "ancho": int(ancho),
                "perfil": int(perfil),
                "rodado": rodado,
                "label": f"{ancho}/{perfil} R{rodado}",
                "ofertas": n,
            }
        )
    out = Path(__file__).resolve().parents[1] / "03-datos" / "discovered-sizes.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
    log.info("total distintas=%s → %s", len(rows), out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
