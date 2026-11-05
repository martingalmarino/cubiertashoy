# Prompt 04 — Pulido de diseño, responsive, SEO y JSON-LD
## Pegá esto en Cursor (Agent)
```
Hacé una revisión de diseño completa como diseñador senior: revisá home y /medida a 375, 768 y 1280px; corregí espaciados inconsistentes, jerarquía tipográfica, alineación de números (tabular), estados hover/focus/disabled, contraste. Agregá microinteracciones del design-system (conteo de precio, pulse del botón, hover de filas) respetando prefers-reduced-motion. Creá una página 404 y un loading.tsx con skeletons de marca.
SEO: generateMetadata en cada página (title "Precio cubiertas 175/65 R14 hoy | desde $ X | cubiertashoy", description con precio desde y cantidad de tiendas), canonical, OpenGraph; imagen OG dinámica con next/og mostrando la medida en mono y el precio desde. JSON-LD: Organization + WebSite en layout; en /medida: BreadcrumbList, FAQPage y Product con AggregateOffer (lowPrice, highPrice, offerCount, priceCurrency ARS). robots.ts y sitemap.ts básicos. Favicon con la cápsula "hoy".
Listame al final qué cambiaste y capturas o descripción de cada breakpoint.
```
## Checklist
- [ ] Rich Results Test (validator.schema.org) sin errores en /medida/175-65-r14.
- [ ] Imagen OG se ve al pegar el link (probar en opengraph.xyz tras deploy).
- [ ] Navegación completa solo con teclado.
- [ ] Lighthouse mobile ≥ 90 en las 4 categorías.
