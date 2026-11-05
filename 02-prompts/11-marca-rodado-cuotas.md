# Prompt 11 — Páginas /marca, /rodado, /cuotas
## Pegá esto en Cursor (Agent)
```
Creá: /marca/[slug] (ej. /marca/fate: medidas disponibles con precio desde, modelos de la marca, rango de precios) y /medida/[slug]/[marca] (ofertas de esa marca en esa medida — patrón "precio cubiertas fate 185 60 r15"); /rodado/[n] (13 a 18: grilla de medidas del rodado con precio desde); /cuotas (ofertas con más cuotas sin interés, filtrable por medida, con aclaración de que las condiciones cambian). Solo generar páginas con ≥3 ofertas reales (evitar páginas vacías/thin content). Metadata y JSON-LD como en /medida. Enlazado interno desde /medida a marca y rodado.
```
## Checklist
- [x] No hay páginas con 0–2 ofertas indexables (noindex si quedan).
- [x] /medida/185-60-r15/fate funciona.
