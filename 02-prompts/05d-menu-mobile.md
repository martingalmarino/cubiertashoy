# Prompt 05d — Menú mobile roto

> Pegalo entero en Cursor (modo Agent).

---

## PROMPT PARA CURSOR

El menú hamburguesa en mobile se despliega **roto** (panel/overlay cortado o mal posicionado).

### Causa
En `components/Header.tsx` el drawer mobile (`fixed inset-0 z-50`) está **dentro** del `<header className="sticky … backdrop-blur-md">`. `backdrop-filter` / `filter` crea un containing block: el `position: fixed` deja de anclarse al viewport y se limita a la altura del header (~56 px). Por eso se ve “todo roto”.

### Arreglo
1. Sacá el panel mobile **fuera** del stacking/containing del header con blur. Preferido: `createPortal(…, document.body)` (React DOM) para el bloque `{menuOpen ? …}`. Alternativa: mover el markup del drawer a un sibling fuera del `<header>`, no hijo.
2. El overlay + panel deben ser `fixed inset-0 z-50` relativos al **viewport** (cubre toda la pantalla).
3. Panel derecho: `absolute inset-y-0 right-0 w-[min(100%,320px)]`, fondo sólido, sin quedar debajo del header sticky.
4. Mantené: `body { overflow: hidden }` mientras está abierto; cerrar con overlay, botón X, Escape, y al hacer click en un link.
5. Links mobile: Medidas, Autos, Cuotas — `h-12 text-lg`, targets ≥ 44 px.
6. No uses `Sheet` de shadcn si no está; el portal + markup actual alcanza.
7. Verificá que `overflow-x-clip` del `body`/`main` **no** recorte el menú (con portal a `body` no debería).

### No tocar
Scrapers, datos, SEO, ni el resto del header desktop.

### Cierre
1. `npm run build` + lint OK.
2. Capturas 390: menú cerrado, menú abierto (overlay + panel completo), y después de navegar a /medidas.
3. Archivos tocados.
