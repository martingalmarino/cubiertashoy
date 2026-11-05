# Prompt 10 — Páginas /auto/[slug]
## Antes
Completá 03-datos/autos-medidas.csv (reemplazá los TODO) verificando con la ficha técnica del fabricante o el manual. Fuentes útiles: sitios de marcas, fichas de tiendas ("compatible con…"), wheel-size.com (verificar).
## Pegá esto en Cursor (Agent)
```
Cargá autos-medidas.csv a tablas vehicles(slug, marca, modelo) y vehicle_sizes(vehicle_id, version, anio_desde, anio_hasta, size_id, original BOOL). Creá /auto (índice por marca) y /auto/[slug] según el wireframe: selector de versión/año, card "Tu medida" con precio desde, top 3 ofertas, "Verificá la medida en el flanco" con la ilustración SVG, otras medidas del modelo, FAQ, JSON-LD BreadcrumbList + FAQPage. Habilitá el tab "Por auto" del buscador de la home (combobox marca→modelo con búsqueda). Slugs: chevrolet-onix, volkswagen-gol-trend, fiat-cronos.
```
## Checklist
- [x] /auto/chevrolet-onix muestra 185/70 R14 con precio.
- [x] El buscador "Por auto" llega a la página correcta en ≤3 toques en mobile.
