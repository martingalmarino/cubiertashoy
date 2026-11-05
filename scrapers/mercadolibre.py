"""
Scraper Mercado Libre vía API oficial (OAuth refresh token).

Secrets:
  ML_CLIENT_ID, ML_CLIENT_SECRET, ML_REFRESH_TOKEN
Opcional afiliados:
  ML_AFFILIATE_TAG  → se agrega como query matt_tool=… al permalink

Filtros:
  - condición = new
  - reputación del vendedor verde (power_seller_status / level_id)
"""

from __future__ import annotations

import logging
import os
import time
from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import urllib.error
import urllib.request

from base import OfferRow, ScrapeResult, Scraper, extract_modelo, unit_price
from parser import ParsedTitulo, matches_size, parse_titulo

log = logging.getLogger("scrapers.mercadolibre")

SITE = "MLA"
CATEGORY_TIRES = "MLA1747"  # Autos, Motos y Otros > Neumáticos
SEARCH_LIMIT = 50
GREEN_LEVELS = {"5_green", "4_light_green"}


def _http_json(
    url: str,
    *,
    method: str = "GET",
    headers: Optional[dict[str, str]] = None,
    data: Optional[bytes] = None,
    timeout: float = 25,
) -> Any:
    req = urllib.request.Request(
        url, data=data, method=method, headers=headers or {}
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        import json

        return json.loads(resp.read().decode("utf-8"))


def _refresh_access_token() -> str:
    client_id = os.environ.get("ML_CLIENT_ID", "").strip()
    client_secret = os.environ.get("ML_CLIENT_SECRET", "").strip()
    refresh = os.environ.get("ML_REFRESH_TOKEN", "").strip()
    if not client_id or not client_secret or not refresh:
        raise RuntimeError(
            "Faltan ML_CLIENT_ID / ML_CLIENT_SECRET / ML_REFRESH_TOKEN"
        )

    body = urlencode(
        {
            "grant_type": "refresh_token",
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh,
        }
    ).encode("utf-8")
    try:
        data = _http_json(
            "https://api.mercadolibre.com/oauth/token",
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data=body,
        )
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"OAuth ML falló: HTTP {exc.code}") from exc

    token = data.get("access_token")
    if not token:
        raise RuntimeError(f"OAuth ML sin access_token: {data}")
    # Si ML rota el refresh token, loguear para actualizar secrets
    new_refresh = data.get("refresh_token")
    if new_refresh and new_refresh != refresh:
        log.warning(
            "ML devolvió un refresh_token nuevo; actualizá ML_REFRESH_TOKEN en secrets"
        )
    return str(token)


def _with_affiliate(permalink: str) -> Optional[str]:
    tag = os.environ.get("ML_AFFILIATE_TAG", "").strip()
    if not tag or not permalink:
        return None
    parts = urlsplit(permalink)
    qs = dict(parse_qsl(parts.query, keep_blank_values=True))
    qs["matt_tool"] = tag
    return urlunsplit(
        (parts.scheme, parts.netloc, parts.path, urlencode(qs), parts.fragment)
    )


def _seller_is_green(seller: dict[str, Any]) -> bool:
    seller_rep = seller.get("seller_reputation") or {}
    level = str(seller_rep.get("level_id") or "")
    power = seller_rep.get("power_seller_status")
    if level in GREEN_LEVELS:
        return True
    # power_seller_status gold/platinum suelen ir con reputación alta
    if power in ("gold", "platinum") and (not level or "green" in level):
        return True
    return False


def _marca_from_attrs(attrs: list[dict[str, Any]], titulo: str) -> str:
    for a in attrs:
        if a.get("id") == "BRAND" or (a.get("name") or "").lower() == "marca":
            val = a.get("value_name")
            if val:
                return str(val)
    # fallback: primera palabra del título
    return (titulo.split() or ["—"])[0]


def _offer_from_item(
    item: dict[str, Any],
    sizes: list[dict[str, Any]],
) -> Optional[OfferRow]:
    if item.get("condition") != "new":
        return None
    if item.get("status") not in (None, "active"):
        return None
    if not _seller_is_green(item.get("seller") or {}):
        return None

    titulo = item.get("title") or ""
    parsed: Optional[ParsedTitulo] = parse_titulo(titulo)
    if not parsed:
        return None
    if not any(
        matches_size(parsed, s["ancho"], s["perfil"], s["rodado"]) for s in sizes
    ):
        return None

    price = item.get("price")
    if price is None or float(price) <= 0:
        return None

    unidades = parsed.unidades_por_paquete
    precio_u = unit_price(price, unidades)
    permalink = item.get("permalink") or ""
    attrs = item.get("attributes") or []
    marca = _marca_from_attrs(attrs, titulo)
    modelo = extract_modelo(titulo, marca, parsed)
    affiliate = _with_affiliate(permalink)

    return OfferRow(
        external_id=str(item.get("id")),
        url=permalink,
        affiliate_url=affiliate,
        marca=marca,
        modelo=modelo,
        titulo_original=titulo,
        parsed=parsed,
        precio_efectivo=precio_u,
        precio_tarjeta=precio_u,
        precio_lista=None,
        cuotas_sin_interes=None,
        colocacion_incluida=None,
        en_stock=item.get("available_quantity", 1) > 0,
    )


class MercadoLibreScraper(Scraper):
    store_slug = "mercadolibre"
    base_url = "https://www.mercadolibre.com.ar"

    def __init__(self, dry_run: bool = False) -> None:
        super().__init__(dry_run=dry_run)
        self._token: Optional[str] = None

    def _auth_headers(self) -> dict[str, str]:
        if not self._token:
            self._token = _refresh_access_token()
        return {
            "Authorization": f"Bearer {self._token}",
            "Accept": "application/json",
            "User-Agent": "cubiertashoy-bot/0.1 (+https://cubiertashoy.com)",
        }

    def _api_get(self, path: str, params: dict[str, Any]) -> Any:
        qs = urlencode(params)
        url = f"https://api.mercadolibre.com{path}?{qs}"
        self._throttle()
        try:
            return _http_json(url, headers=self._auth_headers())
        except urllib.error.HTTPError as exc:
            if exc.code == 401:
                self._token = None
                return _http_json(url, headers=self._auth_headers())
            if exc.code == 429:
                time.sleep(5)
                raise ConnectionError(f"429 ML: {url}") from exc
            if exc.code >= 500:
                raise ConnectionError(f"HTTP {exc.code}: {url}") from exc
            body = exc.read().decode("utf-8", errors="replace")[:300]
            raise RuntimeError(f"ML API {exc.code}: {body}") from exc

    def scrape(self, sizes: list[dict[str, Any]]) -> ScrapeResult:
        result = ScrapeResult()
        seen: set[str] = set()

        for size in sizes:
            q = f"{size['ancho']}/{size['perfil']} R{size['rodado']}"
            offset = 0
            try:
                while offset < 200:
                    data = self._api_get(
                        f"/sites/{SITE}/search",
                        {
                            "q": q,
                            "category": CATEGORY_TIRES,
                            "condition": "new",
                            "limit": SEARCH_LIMIT,
                            "offset": offset,
                        },
                    )
                    results = data.get("results") or []
                    if not results:
                        break
                    for item in results:
                        item_id = str(item.get("id") or "")
                        if not item_id or item_id in seen:
                            continue
                        # search payload a veces trae seller; si no, igual filtramos
                        try:
                            offer = _offer_from_item(item, [size])
                        except Exception as exc:  # noqa: BLE001
                            log.debug("skip %s: %s", item_id, exc)
                            result.errores += 1
                            continue
                        if offer:
                            seen.add(item_id)
                            result.offers.append(offer)
                    paging = data.get("paging") or {}
                    total = int(paging.get("total") or 0)
                    offset += SEARCH_LIMIT
                    if offset >= total:
                        break
            except Exception as exc:  # noqa: BLE001
                log.exception("ML search falló para %s: %s", q, exc)
                result.errores += 1

        log.info(
            "ML offers=%s errores=%s (sizes=%s)",
            len(result.offers),
            result.errores,
            len(sizes),
        )
        return result
