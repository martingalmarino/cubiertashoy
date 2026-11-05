# Prompt 05c — Medidas populares + sacar cards “Tres pasos”

> Pegalo entero en Cursor (modo Agent) después de 05a/05b.

---

## PROMPT PARA CURSOR

Vas a hacer dos ajustes de UI en la home de cubiertashoy. **No toques scrapers, datos, rutas, SEO ni JSON-LD.**

### A — Bloque “Medidas populares” (mobile)

1. **Outlier de precio:** si el `desde $` de un chip es **&lt; 50% de la mediana** de los precios “desde” del mismo bloque (o &lt; $50.000 si hay pocos), **no muestres ese chip** (o mostrá la medida sin precio). Hoy `205/55 R16` aparece a ~$33.250 y rompe confianza.
2. **Chips en &lt;md:** medida `font-mono text-sm font-semibold whitespace-nowrap`; precio `text-[11px] text-tinta-500 font-mono` → `desde $75.390` (si aún aprieta: `desde $75k` solo en mobile).
3. **Subtítulo:** reemplazá “Las más buscadas esta semana” por **“Las medidas más comunes”** (no tenemos analytics de “buscadas”). Desktop igual.
4. No cambies la grilla 3×3 ni el CTA “Ver todas las medidas”.

### B — Sacá las cards “Tres pasos / Cómo funciona”

Eliminá por completo la sección de home con las 3 cards de colores:
- “Elegí tu medida” (amarilla)
- “Compará ofertas” (verde)
- “Comprá con criterio” (azul)
…y el título/lead “Tres pasos. Sin cuentas ni vueltas.”

También:
- Borrá el componente si queda huérfano (p. ej. `HowItWorks`, `Steps`, `TrustCards` o similar) y sus imports.
- Cualquier copy residual con **“flanco”** en esa sección: fuera con la sección.
- **No** dejes pills con “Hoy hay 0 ofertas…” ni flechas decorativas.

### C — Reemplazo mínimo (opcional pero preferido)

En el lugar de esas cards, **una sola línea de trust** debajo del buscador / arriba de Medidas populares, con datos reales ya disponibles en la página:

`Hoy comparamos {n_ofertas} ofertas de {n_tiendas} tiendas · actualizado {fecha_relativa}`

- Tipografía: `text-sm text-tinta-500 text-center` (o left en desktop).
- Si `n_ofertas === 0`, ocultá la línea (`return null`); nunca muestres “0 ofertas”.
- Sin cards, sin iconos, sin flechas.

### Cierre

1. `npm run build` y `npm run lint` OK.
2. Capturas mobile 390 de la home: antes/después del bloque Medidas populares y de la zona donde estaban las cards.
3. Lista de archivos tocados.
