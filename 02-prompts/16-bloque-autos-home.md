# Prompt 16 — Bloque “Autos populares” en la home

> Pegalo entero en Cursor (modo Agent).

---

## PROMPT PARA CURSOR

Agregá en la home un bloque **“Autos populares”** (después de Medidas populares / trust line, antes de Tiendas). **No toques scrapers ni precios.**

### Contenido
- Título: `Autos populares`
- Subtítulo: `Buscá por modelo y te mostramos la medida habitual`
- 8–12 cards desde `getVehicles()` / `vehicles.json` (prioridad: Onix, Cronos, Gol/Gol Trend, Corolla si está, Hilux, Amarok, Tracker, Sandero, Logan, Fiesta/Ka, Suran/Virtus, Creta — los que existan en data).
- Card: marca chica + modelo destacado + “medida desde {label}” (medida `original: true` o la primera) + “desde $ X” si hay precio para esa medida; si no, solo la medida.
- Click → `/auto/{slug}`.
- CTA: `Ver todos los autos` → `/auto`.
- Mobile: `grid-cols-2 gap-3`; desktop `grid-cols-4`.
- Si hay &lt; 4 vehicles, no renderices el bloque.

### No hacer
- No inventes autos ni medidas.
- No uses la ilustración del “flanco”.

### Cierre
Build + lint OK; captura 390 y desktop; archivos tocados.
