# Prompt 14 — Ampliar medidas del buscador (seed desde scrapers/Neon)

> Pegalo entero en Cursor (modo Agent).

---

## PROMPT PARA CURSOR

El buscador de la home solo muestra perfiles/rodados que existen en `web/data/medidas.json` (hoy ~24). Queda pobre: muchos anchos tienen 1–2 perfiles. Vas a **ampliar el catálogo de medidas** con las que ya aparecen en los scrapers / Neon, sin inventar medidas.

### Objetivo
Que al elegir un ancho común (175, 185, 195, 205…) el select de perfil y rodado tenga las opciones reales del mercado AR que ya scrapeamos.

### Pasos
1. Extraé medidas distintas desde Neon (`products` / `price_snapshots` + parser de título) **o**, si es más simple en local, corré `python scrapers/run.py --store all --dry-run` (o un script de agregación) y listá todos los `(ancho, perfil, rodado)` válidos con ≥1 oferta en stock en al menos una tienda.
2. Mergeá con `web/data/medidas.json` y `03-datos/seed-medidas.json`:
   - Conservá las 24 actuales y su `prioridad`.
   - Agregá las nuevas con `prioridad` después (25, 26…), `tipo` razonable (`auto` / `camioneta` si rodado≥17 y ancho≥215, o según regla que ya usen).
   - `label` = `{ancho}/{perfil} R{rodado}`, `slug` = `{ancho}-{perfil}-r{rodado}`.
   - No dupliques slugs.
3. Meta razonable: **≥60–80 medidas** si hay datos; si hay menos, sumá todas las distintas scrapeadas. No inventes medidas que no vinieron de datos.
4. Asegurate de que el buscador (`MedidaSearch`) siga en cascada (ancho → perfiles de ese ancho → rodados del par) — no hace falta cambiar la lógica, solo el JSON.
5. Páginas `/medida/[slug]`: las nuevas deben resolverse (ISR/dinámico como las actuales). Si no hay ofertas aún para alguna, la página vacía existente está OK.
6. Actualizá sitemap / `getMedidas()` para incluirlas.
7. **No** toques scrapers de tiendas nuevas, diseño, ni SEO copy salvo regenerar listados si hace falta.

### Verificación
- Elegí ancho `185`: deberían aparecer más de 2 perfiles (los que haya en datos).
- Elegí `175/65`: rodados presentes en datos.
- `npm run build` OK.
- Mostrame: cantidad de medidas antes/después, lista de slugs nuevos, y captura del buscador con un ancho popular.

### No hacer
- No listar perfiles/rodados “estándar” inventados sin ofertas.
- No borrar medidas actuales.
