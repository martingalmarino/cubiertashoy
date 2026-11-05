# Prompt 09 — Conectar el sitio a la base (ISR)
## Pegá esto en Cursor (Agent)
```
Reescribí SOLO lib/data.ts para leer de Neon (Drizzle, driver serverless de Neon) en vez de los JSON, manteniendo las mismas firmas. Ofertas = último snapshot de cada producto activo de la medida en las últimas 36 h. Historial = size_daily_stats. "Actualizado hace X" = max(captured_at).
Páginas /medida con revalidate = 43200 (12 h) + revalidación on-demand vía app/api/revalidate/route.ts (POST con secreto, revalidatePath de las medidas afectadas).
Badge de descuento real/inflado con la regla del percentil 75 de 90 días (si hay <14 días de historial, no mostrar badge).
Quitá el ExampleDataBanner cuando la fuente sea la DB; mostrá "Precios de tiendas, pueden cambiar. Verificá en la tienda antes de comprar." Mantené los JSON como fallback si la DB no responde.
```
## Checklist
- [ ] /medida/175-65-r14 muestra precios reales que coinciden con la tienda (chequeá 3 a mano).
- [ ] Links "Ir a la tienda" abren la ficha correcta.
- [ ] Sin banner de ejemplo. **Fin de Fase 2.**
