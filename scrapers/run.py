#!/usr/bin/env python3
"""CLI: python run.py --store all|norauto|naldo|neumaflores|360-neumaticos [--dry-run] [--medida SLUG]."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path
from typing import Type

# Permitir imports locales al correr desde /scrapers o raíz del repo
sys.path.insert(0, str(Path(__file__).resolve().parent))

from base import Scraper, load_env, load_sizes  # noqa: E402
from neumaflores import NeumafloresScraper  # noqa: E402
from vtex import NaldoScraper, NorautoScraper  # noqa: E402
from woo import Woo360Scraper  # noqa: E402

STORES: dict[str, Type[Scraper]] = {
    "norauto": NorautoScraper,
    "naldo": NaldoScraper,
    "neumaflores": NeumafloresScraper,
    "360-neumaticos": Woo360Scraper,
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Scrapers CubiertasHoy")
    parser.add_argument(
        "--store",
        required=True,
        help="all | norauto | naldo | neumaflores | 360-neumaticos",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Imprime ofertas sin guardar en Neon",
    )
    parser.add_argument(
        "--medida",
        default=None,
        help="Slug de medida (ej. 175-65-r14). Sin valor = todas del seed.",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    load_env()

    store_arg = args.store.lower().strip()
    if store_arg == "all":
        selected = list(STORES.items())
    elif store_arg in STORES:
        selected = [(store_arg, STORES[store_arg])]
    elif store_arg in ("360", "360neumaticos"):
        selected = [("360-neumaticos", Woo360Scraper)]
    else:
        print(f"store desconocida: {args.store}", file=sys.stderr)
        return 2

    # Dry-run sin medida → una sola (checklist: medida pedida / filtrado exacto)
    medida = args.medida
    if args.dry_run and not medida:
        medida = "175-65-r14"

    sizes = load_sizes(medida)
    logging.info(
        "scraping %s size(s) → %s (dry_run=%s)",
        len(sizes),
        ", ".join(s for s, _ in selected),
        args.dry_run,
    )

    exit_code = 0
    for slug, cls in selected:
        scraper = cls(dry_run=args.dry_run)
        run_id = None
        try:
            run_id = scraper.start_run()
            result = scraper.scrape(sizes)
            saved = scraper.save(result.offers)
            scraper.finish_run(
                run_id,
                productos=saved,
                errores=result.errores,
                estado="ok" if result.errores == 0 else "ok",
            )
            logging.info(
                "[%s] offers=%s saved=%s errores=%s",
                slug,
                len(result.offers),
                saved,
                result.errores,
            )
            if not args.dry_run and saved == 0:
                logging.warning("[%s] 0 productos guardados", slug)
        except Exception as exc:  # noqa: BLE001
            logging.exception("[%s] falló: %s", slug, exc)
            scraper.finish_run(
                run_id, productos=0, errores=1, estado="error"
            )
            exit_code = 1

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
