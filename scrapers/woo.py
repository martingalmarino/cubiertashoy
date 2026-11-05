"""Scraper WooCommerce Store API: 360 Neumáticos."""

from __future__ import annotations

import logging
from typing import Any, Optional

from base import OfferRow, ScrapeResult, Scraper, extract_modelo, unit_price
from parser import matches_size, parse_titulo

log = logging.getLogger("scrapers.woo")

PER_PAGE = 100
# Categoría única del catálogo público (Store API /products/categories)
CATEGORY_ID = 38  # "Productos" — todas las cubiertas listadas


def _money(prices: dict[str, Any], key: str) -> Optional[int]:
    raw = prices.get(key)
    if raw is None or raw == "":
        return None
    minor = int(prices.get("currency_minor_unit") or 2)
    return int(round(int(raw) / (10**minor)))


def _header(headers: Any, name: str) -> Optional[str]:
    if not headers:
        return None
    lower = name.lower()
    if hasattr(headers, "get"):
        return headers.get(name) or headers.get(lower)
    try:
        for k, v in dict(headers).items():
            if str(k).lower() == lower:
                return str(v)
    except Exception:  # noqa: BLE001
        return None
    return None


def _offer_from_product(
    product: dict[str, Any],
    sizes: list[dict[str, Any]],
) -> Optional[OfferRow]:
    titulo = product.get("name") or ""
    parsed = parse_titulo(titulo)
    if not parsed:
        return None
    if not any(
        matches_size(parsed, s["ancho"], s["perfil"], s["rodado"]) for s in sizes
    ):
        return None

    prices = product.get("prices") or {}
    precio = _money(prices, "price")
    if precio is None or precio <= 0:
        return None
    regular = _money(prices, "regular_price")

    unidades = parsed.unidades_por_paquete
    precio_u = unit_price(precio, unidades)
    lista_u = unit_price(regular, unidades) if regular else None

    marca = _guess_marca(titulo)
    modelo = extract_modelo(titulo, marca, parsed)

    return OfferRow(
        external_id=str(product.get("id")),
        url=product.get("permalink") or "",
        marca=marca,
        modelo=modelo,
        titulo_original=titulo,
        parsed=parsed,
        precio_efectivo=precio_u,
        precio_tarjeta=precio_u,
        precio_lista=lista_u,
        cuotas_sin_interes=None,
        colocacion_incluida=None,
        en_stock=bool(product.get("is_in_stock")),
    )


def _guess_marca(titulo: str) -> str:
    skip = {
        "cubierta",
        "cubiertas",
        "neumatico",
        "neumáticos",
        "neumaticos",
        "kit",
        "juego",
    }
    for part in titulo.replace("/", " ").split():
        clean = part.strip(",.-")
        if clean.lower() in skip:
            continue
        if clean.isdigit():
            continue
        if len(clean) >= 2:
            return clean
    return "—"


class Woo360Scraper(Scraper):
    store_slug = "360-neumaticos"
    base_url = "https://360neumaticos.com.ar"

    def scrape(self, sizes: list[dict[str, Any]]) -> ScrapeResult:
        """Lista el catálogo completo (categoría Productos) paginando con X-WP-TotalPages."""
        result = ScrapeResult()
        seen: set[str] = set()
        page = 1
        total_pages = 1
        catalog_total = 0

        while page <= total_pages:
            url = (
                f"{self.base_url}/wp-json/wc/store/products"
                f"?category={CATEGORY_ID}&per_page={PER_PAGE}&page={page}"
            )
            try:
                resp = self.fetch_response(url)
                headers = getattr(resp, "headers", {}) or {}
                if page == 1:
                    tp = _header(headers, "X-WP-TotalPages")
                    tt = _header(headers, "X-WP-Total")
                    if tp and tp.isdigit():
                        total_pages = max(1, int(tp))
                    if tt and tt.isdigit():
                        catalog_total = int(tt)
                    log.info(
                        "360 Store API: X-WP-Total=%s X-WP-TotalPages=%s",
                        catalog_total or "?",
                        total_pages,
                    )
                try:
                    data = resp.json()
                except Exception:
                    body = resp.body
                    if isinstance(body, bytes):
                        import json as _json

                        data = _json.loads(body.decode("utf-8"))
                    else:
                        import json as _json

                        data = _json.loads(str(body))
            except Exception as exc:  # noqa: BLE001
                log.error("error Woo %s: %s", url, exc)
                result.errores += 1
                break

            if not isinstance(data, list) or not data:
                break

            for product in data:
                try:
                    offer = _offer_from_product(product, sizes)
                except Exception as exc:  # noqa: BLE001
                    log.warning("parse woo fail: %s", exc)
                    result.errores += 1
                    continue
                if not offer or offer.external_id in seen:
                    continue
                seen.add(offer.external_id)
                result.offers.append(offer)

            if len(data) < PER_PAGE and page >= total_pages:
                break
            page += 1
            if page > 50:
                log.warning("360: tope de seguridad de paginación")
                break

        log.info(
            "360: catálogo API=%s, match seed=%s (páginas recorridas %s/%s)",
            catalog_total or "?",
            len(result.offers),
            min(page, total_pages),
            total_pages,
        )
        return result
