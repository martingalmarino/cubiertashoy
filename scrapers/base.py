"""Scraper base: fetch cortés, robots.txt, rate limit, upsert a Neon."""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional
from urllib.robotparser import RobotFileParser

import psycopg
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from scrapling.fetchers import Fetcher
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from parser import ParsedTitulo, size_slug

log = logging.getLogger("scrapers")

USER_AGENT = "cubiertashoy-bot/0.1 (+https://cubiertashoy.com/contacto)"
REQUEST_GAP_S = 2.5
TIMEOUT_S = 20


def load_env() -> None:
    root = Path(__file__).resolve().parents[1]
    for candidate in (
        root / "web" / ".env.local",
        root / ".env.local",
        Path(__file__).resolve().parent / ".env",
    ):
        if candidate.exists():
            load_dotenv(candidate, override=False)


def database_url() -> str:
    import os

    load_env()
    url = (
        os.environ.get("DATABASE_URL")
        or os.environ.get("DATABASE_POSTGRES_URL")
        or os.environ.get("DATABASE_URL_UNPOOLED")
    )
    if not url:
        raise RuntimeError("DATABASE_URL no definida (web/.env.local)")
    return url


class OfferRow(BaseModel):
    """Producto normalizado listo para upsert."""

    external_id: str
    url: str
    marca: str
    modelo: str
    titulo_original: str
    parsed: ParsedTitulo
    precio_efectivo: int  # ARS por unidad
    precio_tarjeta: int
    precio_lista: Optional[int] = None
    cuotas_sin_interes: Optional[int] = None
    colocacion_incluida: Optional[bool] = None
    en_stock: Optional[bool] = None
    affiliate_url: Optional[str] = None


@dataclass
class ScrapeResult:
    offers: list[OfferRow] = field(default_factory=list)
    errores: int = 0


class Scraper:
    store_slug: str = ""
    base_url: str = ""

    def __init__(self, dry_run: bool = False) -> None:
        self.dry_run = dry_run
        self._last_request_at = 0.0
        self._robots: Optional[RobotFileParser] = None
        self._robots_checked = False

    # --- HTTP -----------------------------------------------------------------

    def _ensure_robots(self) -> None:
        if self._robots_checked:
            return
        self._robots_checked = True
        robots_url = f"{self.base_url.rstrip('/')}/robots.txt"
        rp = RobotFileParser()
        try:
            self._throttle()
            resp = Fetcher.get(
                robots_url,
                headers={"User-Agent": USER_AGENT},
                timeout=TIMEOUT_S,
            )
            body = resp.body
            if isinstance(body, bytes):
                text = body.decode(resp.encoding or "utf-8", errors="replace")
            else:
                text = str(body)
            rp.parse(text.splitlines())
            self._robots = rp
        except Exception as exc:  # noqa: BLE001
            log.warning("No se pudo leer robots.txt de %s: %s", robots_url, exc)
            self._robots = None

    def _allowed(self, url: str) -> bool:
        self._ensure_robots()
        if self._robots is None:
            return True
        try:
            return bool(self._robots.can_fetch(USER_AGENT, url))
        except Exception:  # noqa: BLE001
            return True

    def _throttle(self) -> None:
        elapsed = time.monotonic() - self._last_request_at
        if elapsed < REQUEST_GAP_S:
            time.sleep(REQUEST_GAP_S - elapsed)
        self._last_request_at = time.monotonic()

    @retry(
        retry=retry_if_exception_type((ConnectionError, TimeoutError, OSError)),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        stop=stop_after_attempt(4),
        reraise=True,
    )
    def fetch(
        self, url: str, *, as_json: bool = False
    ) -> Any:
        resp = self.fetch_response(url)
        if as_json:
            try:
                return resp.json()
            except Exception:
                body = resp.body
                if isinstance(body, bytes):
                    return json.loads(body.decode("utf-8"))
                return json.loads(str(body))
        return resp

    def fetch_response(self, url: str) -> Any:
        """GET cortés; devuelve el Response de Scrapling (con .headers / .json())."""
        if not self._allowed(url):
            raise PermissionError(f"robots.txt bloquea {url}")

        self._throttle()
        log.debug("GET %s", url)
        resp = Fetcher.get(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "application/json, text/html, */*",
            },
            timeout=TIMEOUT_S,
        )
        status = getattr(resp, "status", None) or 0
        if status == 429:
            time.sleep(5)
            raise ConnectionError(f"429 rate limit: {url}")
        if status >= 500:
            raise ConnectionError(f"HTTP {status}: {url}")
        if status == 0:
            raise ConnectionError(f"sin respuesta: {url}")
        return resp

    # --- Persistencia ---------------------------------------------------------

    def save(self, offers: list[OfferRow]) -> int:
        """Upsert products + insert price_snapshots. Devuelve cantidad guardada."""
        if self.dry_run:
            for o in offers:
                print(
                    json.dumps(
                        {
                            "store": self.store_slug,
                            "titulo": o.titulo_original,
                            "medida": size_slug(
                                o.parsed.ancho, o.parsed.perfil, o.parsed.rodado
                            ),
                            "marca": o.marca,
                            "modelo": o.modelo,
                            "precio_unitario": o.precio_efectivo,
                            "unidades": o.parsed.unidades_por_paquete,
                            "url": o.url,
                        },
                        ensure_ascii=False,
                    )
                )
            return len(offers)

        if not offers:
            return 0

        saved = 0
        with psycopg.connect(database_url()) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id FROM stores WHERE slug = %s", (self.store_slug,)
                )
                row = cur.fetchone()
                if not row:
                    raise RuntimeError(f"store '{self.store_slug}' no existe en DB")
                store_id = row[0]

                for o in offers:
                    slug = size_slug(
                        o.parsed.ancho, o.parsed.perfil, o.parsed.rodado
                    )
                    cur.execute("SELECT id FROM sizes WHERE slug = %s", (slug,))
                    size_row = cur.fetchone()
                    if not size_row:
                        log.debug("medida %s no está en seed, skip", slug)
                        continue
                    size_id = size_row[0]

                    cur.execute(
                        """
                        INSERT INTO products (
                          store_id, external_id, url, affiliate_url, marca, modelo, size_id,
                          indice_carga, indice_velocidad, unidades_por_paquete,
                          titulo_original, activo, first_seen, last_seen
                        ) VALUES (
                          %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, true, now(), now()
                        )
                        ON CONFLICT (store_id, external_id) DO UPDATE SET
                          url = EXCLUDED.url,
                          affiliate_url = COALESCE(EXCLUDED.affiliate_url, products.affiliate_url),
                          marca = EXCLUDED.marca,
                          modelo = EXCLUDED.modelo,
                          size_id = EXCLUDED.size_id,
                          indice_carga = EXCLUDED.indice_carga,
                          indice_velocidad = EXCLUDED.indice_velocidad,
                          unidades_por_paquete = EXCLUDED.unidades_por_paquete,
                          titulo_original = EXCLUDED.titulo_original,
                          activo = true,
                          last_seen = now()
                        RETURNING id
                        """,
                        (
                            store_id,
                            o.external_id,
                            o.url,
                            o.affiliate_url,
                            o.marca,
                            o.modelo,
                            size_id,
                            o.parsed.indice_carga,
                            o.parsed.indice_velocidad,
                            o.parsed.unidades_por_paquete,
                            o.titulo_original,
                        ),
                    )
                    product_id = cur.fetchone()[0]

                    cur.execute(
                        """
                        INSERT INTO price_snapshots (
                          product_id, captured_at,
                          precio_unitario_efectivo, precio_unitario_tarjeta,
                          precio_lista, cuotas_sin_interes,
                          colocacion_incluida, en_stock
                        ) VALUES (
                          %s, now(), %s, %s, %s, %s, %s, %s
                        )
                        """,
                        (
                            product_id,
                            o.precio_efectivo,
                            o.precio_tarjeta,
                            o.precio_lista,
                            o.cuotas_sin_interes,
                            o.colocacion_incluida,
                            o.en_stock,
                        ),
                    )
                    saved += 1
            conn.commit()
        return saved

    def start_run(self) -> Optional[int]:
        if self.dry_run:
            return None
        with psycopg.connect(database_url()) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id FROM stores WHERE slug = %s", (self.store_slug,)
                )
                row = cur.fetchone()
                if not row:
                    raise RuntimeError(f"store '{self.store_slug}' no existe")
                cur.execute(
                    """
                    INSERT INTO scrape_runs (store_id, started_at, estado)
                    VALUES (%s, now(), 'running')
                    RETURNING id
                    """,
                    (row[0],),
                )
                run_id = cur.fetchone()[0]
            conn.commit()
        return run_id

    def finish_run(
        self,
        run_id: Optional[int],
        *,
        productos: int,
        errores: int,
        estado: str = "ok",
    ) -> None:
        if self.dry_run or run_id is None:
            return
        with psycopg.connect(database_url()) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE scrape_runs
                    SET finished_at = now(),
                        productos = %s,
                        errores = %s,
                        estado = %s::scrape_estado
                    WHERE id = %s
                    """,
                    (productos, errores, estado, run_id),
                )
            conn.commit()

    def scrape(self, sizes: list[dict[str, Any]]) -> ScrapeResult:
        raise NotImplementedError


def load_sizes(medida: Optional[str] = None) -> list[dict[str, Any]]:
    path = Path(__file__).resolve().parents[1] / "web" / "data" / "medidas.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    medidas = data["medidas"]
    if medida:
        slug = medida.lower().strip()
        medidas = [m for m in medidas if m["slug"] == slug]
        if not medidas:
            raise SystemExit(f"medida '{medida}' no está en seed")
    return medidas


def unit_price(raw: float | int, unidades: int) -> int:
    """Normaliza a entero ARS por unidad."""
    unidades = max(1, unidades)
    return int(round(float(raw) / unidades))


def extract_modelo(titulo: str, marca: str, parsed: ParsedTitulo) -> str:
    """Heurística: saca marca y medida del título."""
    t = titulo
    if marca:
        t = re_sub_ci(t, marca, "")
    medida_pat = (
        rf"{parsed.ancho}\s*[/\-\s]\s*{parsed.perfil}\s*(?:[Rr]|[/\-\s])\s*{parsed.rodado}"
    )
    import re

    t = re.sub(medida_pat, " ", t, flags=re.I)
    t = re.sub(
        r"\b(?:neum[aá]tico?s?|cubiertas?)\b", " ", t, flags=re.I
    )
    if parsed.indice_carga and parsed.indice_velocidad:
        t = re.sub(
            rf"\b{re.escape(parsed.indice_carga)}\s*{parsed.indice_velocidad}\b",
            " ",
            t,
            flags=re.I,
        )
    t = re.sub(r"\s+", " ", t).strip(" -–,")
    return t or marca or "—"


def re_sub_ci(text: str, needle: str, repl: str) -> str:
    import re

    if not needle:
        return text
    return re.sub(re.escape(needle), repl, text, count=1, flags=re.I)


def absolutize(base: str, path: str) -> str:
    if path.startswith("http"):
        return path
    return f"{base.rstrip('/')}/{path.lstrip('/')}"
