# Prompt 13 — Sitemap, Search Console y analítica
## Pasos manuales
- Comprá el dominio en nic.ar (verificá disponibilidad), conectalo en Vercel → Domains.
- Google Search Console: verificá el dominio (registro DNS) y enviá /sitemap.xml.
## Pegá esto en Cursor (Agent)
```
sitemap.ts dinámico con todas las medidas, autos, marcas, rodados (lastModified = último snapshot), dividido si supera 5.000 URLs. Agregá Vercel Web Analytics y Speed Insights. Eventos: click_tienda (tienda, medida, precio), click_afiliado, lead_enviado, busqueda_medida. Página /medidas (índice A–Z por rodado) para enlazado interno. Revisá Core Web Vitals y que cada página tenga H1 único y title único. Preparé el slot para AdSense (componente AdSlot que no rompa el CLS, desactivado por variable de entorno hasta aprobación).
```
## Checklist
- [ ] Sitemap aceptado en Search Console. *(código listo: /sitemap.xml; verificación DNS manual)*
- [ ] Eventos visibles en Vercel Analytics. *(track: click_tienda, click_afiliado, lead_enviado, busqueda_medida)*
- [ ] CLS < 0.1 con AdSlot activo. *(AdSlot con altura fija; activar con NEXT_PUBLIC_ADSENSE_*)*
