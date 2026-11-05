"""Scraper Neumaflores (Shopify): colección + JSON-LD / products.json."""

from __future__ import annotations

import json
import logging
import re
from typing import Any, Optional

from base import OfferRow, ScrapeResult, Scraper, extract_modelo, unit_price
from parser import matches_size, parse_titulo

log = logging.getLogger("scrapers.neumaflores")

COLLECTION_JSON = (
    "https://www.neumaflores.com.ar/collections/neumaticos-auto/products.json"
)
COLLECTION_HTML = (
    "https://www.neumaflores.com.ar/collections/neumaticos-auto"
)
LIMIT = 50

_JSON_LD_RE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.S | re.I,
)
_EFECTIVO_RE = re.compile(
    r"efectivo[^$\d]{0,40}\$?\s*([\d.\s]+)",
    re.I,
)
_TARJETA_RE = re.compile(
    r"tarjeta[^$\d]{0,40}\$?\s*([\d.\s]+)",
    re.I,
)


def _parse_ars(text: str) -> Optional[int]:
    digits = re.sub(r"[^\d]", "", text)
    if not digits:
        return None
    return int(digits)


def _from_shopify_product(
    product: dict[str, Any],
    size_index: list[tuple[int, int, int]],
) -> Optional[OfferRow]:
    titulo = product.get("title") or ""
    parsed = parse_titulo(titulo)
    if not parsed:
        return None
    if not any(
        matches_size(parsed, a, p, r) for a, p, r in size_index
    ):
        return None

    variants = product.get("variants") or []
    if not variants:
        return None
    variant = variants[0]
    raw_price = variant.get("price")
    if raw_price is None:
        return None
    precio = float(raw_price)
    if precio <= 0:
        return None

    compare = variant.get("compare_at_price")
    lista = float(compare) if compare else None

    unidades = parsed.unidades_por_paquete
    precio_u = unit_price(precio, unidades)
    lista_u = unit_price(lista, unidades) if lista else None

    marca = (product.get("vendor") or "").strip() or "—"
    modelo = extract_modelo(titulo, marca, parsed)
    handle = product.get("handle") or ""
    url = f"https://www.neumaflores.com.ar/products/{handle}" if handle else ""

    return OfferRow(
        external_id=str(product.get("id")),
        url=url,
        marca=marca,
        modelo=modelo,
        titulo_original=titulo,
        parsed=parsed,
        precio_efectivo=precio_u,
        precio_tarjeta=precio_u,
        precio_lista=lista_u,
        cuotas_sin_interes=None,
        colocacion_incluida=None,
        en_stock=bool(variant.get("available")),
    )


def _offers_from_json_ld(
    html: str,
    size_index: list[tuple[int, int, int]],
) -> list[OfferRow]:
    offers: list[OfferRow] = []
    for block in _JSON_LD_RE.findall(html):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        nodes = data if isinstance(data, list) else [data]
        for node in nodes:
            if not isinstance(node, dict):
                continue
            typ = node.get("@type")
            types = typ if isinstance(typ, list) else [typ]
            if "Product" not in types:
                continue
            titulo = node.get("name") or ""
            parsed = parse_titulo(titulo)
            if not parsed or not any(
                matches_size(parsed, a, p, r) for a, p, r in size_index
            ):
                continue
            offer_node = node.get("offers") or {}
            if isinstance(offer_node, list):
                offer_node = offer_node[0] if offer_node else {}
            price = offer_node.get("price")
            if price is None:
                continue
            unidades = parsed.unidades_por_paquete
            precio_u = unit_price(float(price), unidades)

            efectivo = precio_u
            tarjeta = precio_u
            em = _EFECTIVO_RE.search(html)
            tm = _TARJETA_RE.search(html)
            if em:
                ev = _parse_ars(em.group(1))
                if ev:
                    efectivo = unit_price(ev, unidades)
            if tm:
                tv = _parse_ars(tm.group(1))
                if tv:
                    tarjeta = unit_price(tv, unidades)

            brand = node.get("brand")
            if isinstance(brand, dict):
                marca = brand.get("name") or "—"
            else:
                marca = (brand or "—") if isinstance(brand, str) else "—"

            sku = str(node.get("sku") or node.get("@id") or titulo)
            url = node.get("url") or ""

            offers.append(
                OfferRow(
                    external_id=sku,
                    url=url,
                    marca=str(marca),
                    modelo=extract_modelo(titulo, str(marca), parsed),
                    titulo_original=titulo,
                    parsed=parsed,
                    precio_efectivo=efectivo,
                    precio_tarjeta=tarjeta,
                    precio_lista=None,
                    en_stock=True,
                )
            )
    return offers


class NeumafloresScraper(Scraper):
    store_slug = "neumaflores"
    base_url = "https://www.neumaflores.com.ar"

    def scrape(self, sizes: list[dict[str, Any]]) -> ScrapeResult:
        result = ScrapeResult()
        size_index = [(s["ancho"], s["perfil"], s["rodado"]) for s in sizes]
        seen: set[str] = set()

        # 1) Preferimos products.json de la colección (Shopify, vía Scrapling Fetcher)
        page = 1
        while True:
            url = f"{COLLECTION_JSON}?limit={LIMIT}&page={page}"
            try:
                data = self.fetch(url, as_json=True)
            except Exception as exc:  # noqa: BLE001
                log.error("neumaflores products.json page %s: %s", page, exc)
                result.errores += 1
                break

            products = (data or {}).get("products") if isinstance(data, dict) else None
            if not products:
                break

            for product in products:
                try:
                    offer = _from_shopify_product(product, size_index)
                except Exception as exc:  # noqa: BLE001
                    log.warning("parse nf product: %s", exc)
                    result.errores += 1
                    continue
                if not offer or offer.external_id in seen:
                    continue
                seen.add(offer.external_id)
                result.offers.append(offer)

            if len(products) < LIMIT:
                break
            page += 1
            if page > 80:
                log.warning("neumaflores: tope de paginación (80)")
                break

        # 2) Complemento HTML/JSON-LD si la colección HTML responde (rate-limit frecuente)
        if not result.offers:
            try:
                resp = self.fetch(f"{COLLECTION_HTML}?page=1")
                html = getattr(resp, "html_content", None) or ""
                if isinstance(html, bytes):
                    html = html.decode("utf-8", errors="replace")
                for offer in _offers_from_json_ld(str(html), size_index):
                    if offer.external_id not in seen:
                        seen.add(offer.external_id)
                        result.offers.append(offer)
            except Exception as exc:  # noqa: BLE001
                log.warning("neumaflores HTML fallback: %s", exc)
                result.errores += 1

        return result
