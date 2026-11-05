"""Tiendas del cron / health. Mercado Libre queda fuera hasta tener OAuth."""

from __future__ import annotations

# Únicas tiendas que scrapeamos en `run.py --store all` y valida `health.py`.
ACTIVE_STORE_SLUGS: tuple[str, ...] = (
    "norauto",
    "naldo",
    "neumaflores",
    "360-neumaticos",
)
