#!/usr/bin/env python3
"""Refresca la vista materializada size_daily_stats."""

from __future__ import annotations

import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import psycopg

from base import database_url, load_env

log = logging.getLogger("scrapers.refresh")


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    load_env()
    with psycopg.connect(database_url()) as conn:
        conn.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY size_daily_stats")
        conn.commit()
    log.info("size_daily_stats refrescada")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
