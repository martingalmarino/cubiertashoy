# Prompt 05b — Sacar el dibujo del flanco y copy en rioplatense

> Pegalo entero en Cursor (modo Agent) después de 05a.

---

## PROMPT PARA CURSOR

Vas a ajustar el bloque de ayuda de medida en la página `/medida/[slug]` (y cualquier otro lugar donde aparezca el mismo copy). **No toques scrapers, datos, rutas, SEO ni JSON-LD.**

### 1 — Sacar el dibujo
- Eliminá por completo la ilustración / caja oscura del “flanco” (arco gris con “195/55 R16” y el texto “Tu medida va acá”). No se entiende y confunde.
- Si el componente es solo ese gráfico (p. ej. `SidewallGraphic`, `TireSidewall`, o similar), borrá el componente y sus imports.
- No reemplaces el dibujo por otro SVG ni por una foto: **nada de gráfico**.

### 2 — Copy en español de Argentina
Reemplazá “flanco” (casi nadie lo usa acá) por **costado** / **costado de la cubierta**.

Texto sugerido del bloque (solo tipografía, sin imagen):

- Título: `Verificá la medida en el costado de tu cubierta`
- Cuerpo: `La medida está grabada en el costado. Si no coincide con {medidaActual}, usá la del costado.`
  - `{medidaActual}` = la medida de la página (ej. `195/55 R16`), en `font-mono`.
- Link (si ya existe): `¿Dónde está tu medida?` — dejalo; si apunta a un ancla/FAQ vacío, ocultalo.

Buscá y reemplazá en todo el repo (UI visible): `flanco` → `costado` / `costado de la cubierta` según el contexto. No dejes “flanco” en títulos, subtítulos, alt, aria-label ni tooltips.

### 3 — Si el bloque no aporta
Si después de sacar el dibujo el tip queda redundante con el H1/meta de la página, **ocultá el bloque entero** (`return null`). Preferible no tenerlo a dejar un bloque flojo.

### Cierre
1. `npm run build` y `npm run lint` sin errores.
2. Mostrame capturas mobile (390) y desktop de `/medida/...` después del cambio + lista de archivos tocados.
