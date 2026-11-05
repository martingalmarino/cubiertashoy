# Prompt 08 — Cron en GitHub Actions + alertas
## Pegá esto en Cursor (Agent)
```
Creá .github/workflows/scrape.yml: schedule 2 veces por día (cron '0 11,23 * * *' = 8:00 y 20:00 hora Argentina) + workflow_dispatch. Setup Python 3.11 con cache, instalar requirements, correr `python scrapers/run.py --store all`, luego refrescar la vista size_daily_stats y llamar a un endpoint de revalidación del sitio (POST /api/revalidate con header secreto REVALIDATE_SECRET).
Secrets: DATABASE_URL, REVALIDATE_SECRET, SITE_URL, ALERT_WEBHOOK (opcional).
Health checks en scrapers/health.py, que hagan fallar el job (y manden aviso al webhook / creen un issue con la acción de GitHub) si: una tienda devolvió 0 productos; la cantidad de productos de una tienda cayó >50% vs la corrida anterior; el precio mediano de una medida cambió >50% en un día (probable error de parseo).
```
## Checklist
- [ ] Ejecutar manualmente (Actions → Run workflow) termina en verde.
- [ ] Forzar un fallo (ej. tienda con URL mala) dispara la alerta.
- [ ] Revisar minutos usados en GitHub después de una semana.
