"""Scrapers VTEX: Norauto y Naldo."""

from __future__ import annotations

import logging
from typing import Any, Optional

from base import OfferRow, ScrapeResult, Scraper, absolutize, extract_modelo, unit_price
from parser import matches_size, parse_titulo

log = logging.getLogger("scrapers.vtex")

PAGE_SIZE = 50


def _max_cuotas_sin_interes(installments: list[dict[str, Any]]) -> Optional[int]:
    best = 0
    for inst in installments or []:
        rate = inst.get("InterestRate")
        n = inst.get("NumberOfInstallments") or 0
        if rate == 0 or rate == 0.0:
            if isinstance(n, (int, float)) and int(n) > best:
                best = int(n)
    return best or None


def _offer_from_product(
    product: dict[str, Any],
    *,
    base_url: str,
    ancho: int,
    perfil: int,
    rodado: int,
) -> Optional[OfferRow]:
    titulo = product.get("productName") or product.get("productTitle") or ""
    parsed = parse_titulo(titulo)
    if not parsed or not matches_size(parsed, ancho, perfil, rodado):
        return None

    items = product.get("items") or []
    if not items:
        return None
    item = items[0]
    sellers = item.get("sellers") or []
    if not sellers:
        return None
    commercial = sellers[0].get("commertialOffer") or {}
    price = commercial.get("Price")
    if price is None or float(price) <= 0:
        return None

    list_price = commercial.get("ListPrice")
    qty = commercial.get("AvailableQuantity") or 0
    installments = commercial.get("Installments") or []
    cuotas = _max_cuotas_sin_interes(installments)

    unidades = parsed.unidades_por_paquete
    precio_u = unit_price(price, unidades)
    lista_u = unit_price(list_price, unidades) if list_price else None

    marca = (product.get("brand") or "").strip() or "—"
    modelo = extract_modelo(titulo, marca, parsed)
    external_id = str(product.get("productId") or item.get("itemId") or "")
    link = product.get("link") or product.get("linkText") or ""
    if link and not link.startswith("http"):
        # VTEX a veces devuelve path relativo o linkText
        if "/" in link or link.startswith("/"):
            url = absolutize(base_url, link)
        else:
            url = absolutize(base_url, link)
    else:
        url = link or base_url

    titulo_l = titulo.lower()
    colocacion = None
    if "alineacion" in titulo_l or "alineación" in titulo_l or "balanceo" in titulo_l:
        colocacion = True

    return OfferRow(
        external_id=external_id,
        url=url,
        marca=marca,
        modelo=modelo,
        titulo_original=titulo,
        parsed=parsed,
        precio_efectivo=precio_u,
        precio_tarjeta=precio_u,  # VTEX no distingue efectivo/tarjeta en API
        precio_lista=lista_u,
        cuotas_sin_interes=cuotas,
        colocacion_incluida=colocacion,
        en_stock=bool(qty and qty > 0),
    )


class VtexScraper(Scraper):
    """Búsqueda por ft={ancho}/{perfil}, filtro exacto con parser."""

    def scrape(self, sizes: list[dict[str, Any]]) -> ScrapeResult:
        result = ScrapeResult()
        seen: set[str] = set()

        for size in sizes:
            ancho, perfil, rodado = size["ancho"], size["perfil"], size["rodado"]
            ft = f"{ancho}/{perfil}"
            offset = 0
            while True:
                url = (
                    f"{self.base_url.rstrip('/')}/api/catalog_system/pub/products/search"
                    f"?ft={ft}&_from={offset}&_to={offset + PAGE_SIZE - 1}"
                )
                try:
                    data = self.fetch(url, as_json=True)
                except Exception as exc:  # noqa: BLE001
                    log.error("error VTEX %s: %s", url, exc)
                    result.errores += 1
                    break

                if not isinstance(data, list) or not data:
                    break

                for product in data:
                    try:
                        offer = _offer_from_product(
                            product,
                            base_url=self.base_url,
                            ancho=ancho,
                            perfil=perfil,
                            rodado=rodado,
                        )
                    except Exception as exc:  # noqa: BLE001
                        log.warning("parse product fail: %s", exc)
                        result.errores += 1
                        continue
                    if not offer or offer.external_id in seen:
                        continue
                    seen.add(offer.external_id)
                    result.offers.append(offer)

                if len(data) < PAGE_SIZE:
                    break
                offset += PAGE_SIZE
                # VTEX corta ~2500 resultados
                if offset >= 2500:
                    break

        return result


class NorautoScraper(VtexScraper):
    store_slug = "norauto"
    base_url = "https://www.norauto.com.ar"


class NaldoScraper(VtexScraper):
    store_slug = "naldo"
    base_url = "https://www.naldo.com.ar"
