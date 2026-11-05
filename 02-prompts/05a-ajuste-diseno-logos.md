# Prompt 05a — Ajuste de diseño, logos reales, sin dark mode y mobile-first

> Se puede correr en cualquier momento después de 04d (también después de 09, con datos reales). Pegalo entero en Cursor (modo Agent).
> Capturas del estado actual: `screenshots/v4/` (390 px y 1440 px). Logos: `03-datos/logos/`.

---

## PROMPT PARA CURSOR

Vas a hacer un ajuste de diseño en cubiertashoy. **No toques datos, scrapers, cálculos, rutas, SEO ni JSON-LD.** Antes de empezar: `node scripts/screenshots.mjs antes-05a` (home y `/medida/165-70-r13`, 390 y 1440, scrolleando antes de capturar).

Orden de prioridad: **P1 mobile → P2 dark mode → P3 buscador → P4 medidas populares → P5 tablas → P6 logos → P7 secciones vacías.**

### P1 — Mobile-first general (lo más grave)
Diagnóstico medido a 390 px: **el documento mide 420 px de ancho → hay scroll horizontal en todo el sitio.** Culpables:
- El header: `nav` con 4 ítems (Medidas, Autos, Cuotas + botón tema) desborda hasta 419 px.
- En /medida, las cards de oferta (`ARTICLE` dentro de `LI`) llegan a 543 px (la lista no tiene `min-w-0`, y el texto largo del modelo empuja).
- Los chips de "Medidas populares" se salen del contenedor (sin máscara ni padding correcto).
- En capturas el header sticky aparece encimado a mitad de página.

Arreglos:
1. **Global**: en `app/layout.tsx` `<body className="overflow-x-clip">` y un contenedor único `mx-auto w-full max-w-6xl px-4 sm:px-6`. Todo hijo flex/grid con texto: `min-w-0`. Buscá anchos fijos (`w-[...px]`, `min-w-[...]` mayores a 340 px) y reemplazalos por `w-full`.
2. **Header** (`components/site-header.tsx`): `h-14 md:h-16`. En `<md`: logo + botón menú (`Sheet` de shadcn desde la derecha con los links en `text-lg h-12`). Links inline solo `md:flex`. Sin botón de tema (ver P2). El buscador compacto del header solo `md:` y solo cuando el hero no está visible.
3. **Hero/buscador** (`<sm`): H1 `text-[34px] leading-[1.08]`, subtítulo `text-base`, `pt-10 pb-8`. Buscador como tarjeta `rounded-2xl p-3`, 3 segmentos en `grid grid-cols-3 gap-2`, cada segmento `h-16 rounded-xl bg-fondo px-3`, label `text-[10px]`, valor `text-xl font-mono`. Botón `h-12 w-full`. Trust row: en mobile `grid grid-cols-3 gap-2 text-center` con ícono `size-9` arriba y texto `text-xs` (hoy son 3 filas que ocupan media pantalla), o un carrusel de 1 línea.
4. **Espaciado**: secciones `py-8 sm:py-12 md:py-16`. El hueco entre la trust row y "Medidas populares" (~80 px vacíos) se elimina.
5. **Grilla de MedidaCard**: `grid-cols-2 gap-3` en mobile, con la card a `p-3`: medida `text-sm font-mono font-semibold whitespace-nowrap` (hoy "175/65 R14" se parte en 2 líneas), precio `text-lg`, ícono de cubierta oculto `<sm` (`hidden sm:grid`). Sparkline `h-8`.
6. **/medida encabezado**: H1 `text-[28px] leading-tight`, meta en 2 líneas OK. Chips "Rodado R13 / Cuotas sin interés" con `flex-wrap gap-2`.
7. **CheapestCard mobile**: precio `text-4xl`, caja efectivo/tarjeta `grid-cols-2 gap-2` con labels `text-[10px]` sin cortar ("PRECIO EN EFECTIVO" hoy se parte feo → usar "Efectivo" y "Tarjeta"). CTA `w-full h-12`.
8. **Barra CTA fija inferior**: solo aparece cuando la CheapestCard salió del viewport (IntersectionObserver) y nunca tapa contenido: `<main className="pb-24 md:pb-0">`. Contenido: tienda + precio a la izquierda (`min-w-0 truncate`), botón `h-11 px-4 shrink-0` a la derecha. Respetar `pb-[env(safe-area-inset-bottom)]`.
9. **Gráfico mobile**: `h-56`, ticks del eje X máx. 4 (`interval="preserveStartEnd"`), eje Y ajustado a min/max (no arrancar en $0). Si hay **menos de 5 puntos de historial**, no mostrar el gráfico: mostrar una caja "Estamos juntando historial: volvé en unos días" con el precio de hoy. (Hoy se ve un único punto flotando.)
10. **Footer mobile**: 1 columna, `gap-8`, links `h-10 flex items-center`, aviso legal `text-xs`, `pb-28` si la barra CTA está activa.
11. **Targets táctiles** ≥ 44 px, texto nunca < 12 px salvo labels uppercase (≥ 10 px).

### P2 — Eliminar dark mode por completo
- `npm uninstall next-themes`. Borrá `ThemeProvider`, el componente del toggle (`theme-toggle.tsx` o similar) y su uso en el header.
- Sacá `darkMode` de `tailwind.config.ts`, el bloque `.dark { ... }` de `globals.css` y **todas** las clases `dark:` (`rg -l "dark:" app components | xargs sed -i -E 's/ ?dark:[^ "'"'"'`]+//g'`, revisá el diff).
- `<html lang="es-AR" className="...">` sin `suppressHydrationWarning` por tema; agregá `<meta name="color-scheme" content="light">`.

### P3 — Buscador: la "R" va con Rodado
Hoy la `R` está pegada al final de la columna Perfil (visualmente parece parte de Perfil). Cambio:
- Separadores: entre Ancho y Perfil va `/`; **entre Perfil y Rodado no va separador**.
- Dentro del segmento Rodado, el valor se muestra como prefijo + número: `<span className="font-mono text-tinta-400">R</span><span className="ml-1">14</span>` → se lee **`R 14`** bajo el label "RODADO". El placeholder también: `R 14` en gris.
- El valor guardado sigue siendo `14` (no cambiar la lógica ni el slug).
- Divisores entre segmentos: `border-l border-borde` solamente.
- Botón "Ver precios": `bg-accion-600 text-white hover:bg-accion-700` siempre que esté habilitado (hoy se ve lavado/deshabilitado).

### P4 — Rediseño de "Medidas populares"
Que se vea terminado, no un carrusel vacío.
- Desktop: **grilla densa, sin carrusel ni flecha**: `grid grid-cols-4 lg:grid-cols-6 gap-2`. Mobile: `grid grid-cols-3 gap-2` mostrando 9 y un botón "Ver todas las medidas" (`h-11 w-full rounded-xl bg-white/70 text-sm font-medium`).
- Contenedor: `rounded-2xl p-5 md:p-7 bg-gradient-to-br from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] ring-1 ring-black/5`.
- Encabezado en fila: izquierda título `text-lg md:text-xl font-semibold` + subtítulo `text-sm text-tinta-700/80`; derecha link "Ver todas →" (`text-sm font-medium`, solo `md:`).
- Chip: `h-14 rounded-xl bg-white px-3 flex flex-col items-start justify-center shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition` con 2 líneas: medida `font-mono text-sm font-semibold whitespace-nowrap` y debajo "desde $ 75.390" en `text-xs text-tinta-500 font-mono` (dato que ya existe). Si no hay precio, solo la medida centrada.
- Sin `overflow-x-auto` → nada que se salga del borde.

### P5 — Tablas (desktop) y cards (mobile)
Desktop (`md:` en adelante, `components/store-table.tsx`):
- Tabla `table-fixed w-full`, anchos con `<colgroup>`: Tienda 16%, Marca/Modelo 30%, Índice 7%, Efectivo 11%, Tarjeta 11%, Cuotas 14%, Colocación 8%, acción 3%.
- **Tienda**: logo (P6) `h-5 w-auto max-w-[88px] object-contain` + nombre `sr-only` (o texto chico debajo si no hay logo).
- Modelo `truncate` con `title`; badge "Descuento inflado" en **segunda línea** (`mt-1`), no en la misma fila.
- Precios `text-right font-mono tabular-nums whitespace-nowrap`; encabezados de precio también `text-right`.
- **Chips de cuotas (amarillos) que desbordan**: `inline-flex max-w-full items-center rounded-md bg-ambar-100 px-2 py-0.5 text-[11px] font-medium leading-tight text-[#7A4B00] whitespace-normal text-left`. Texto corto: "6 cuotas s/int." en tabla (completo en `title`). **Si las cuotas son 0 o 1, no mostrar chip** (mostrar `—`); corregí también el plural ("1 cuota").
- Fila `h-14`, `hover:bg-fondo`, más barato con `bg-ahorro-50/50` + `shadow-[inset_3px_0_0_theme(colors.ahorro.600)]`.
- Header `sticky top-14 md:top-16` (debajo del header del sitio), `bg-fondo/95 backdrop-blur`.
- Entre `md` y `lg`: ocultar columnas Índice y Colocación (`hidden lg:table-cell`) para que no se aplaste.
Mobile (`<md`): **mantener cards**, pero:
- `ul` con `grid gap-3 min-w-0`; card `rounded-xl p-4 w-full min-w-0`.
- Fila 1: logo de tienda `h-5` + índice a la derecha. Fila 2: modelo `text-sm font-medium line-clamp-2`. Fila 3: precio `text-xl font-mono font-bold` + tarjeta `text-xs text-tinta-500` al lado. Fila 4: chips `flex flex-wrap gap-1.5`. Botón "Ver" `size-11` alineado a la derecha de la fila 3.
- Segmented "Efectivo/Tarjeta/Cuotas": `w-full grid grid-cols-3 h-10`.

### P6 — Logos reales de tiendas
1. Copiá los archivos de `../03-datos/logos/` (o de donde tengas la carpeta `cubiertas-mvp/03-datos/logos/`) a `public/logos/` del proyecto web (si el app vive en `web/`, entonces `web/public/logos/`):
   - `norauto.svg`, `naldo.svg`, `neumaflores.png`, `360-neumaticos.png`.
   - Optimizá `360-neumaticos.png` a 600 px de ancho (`npx sharp-cli -i ... -o ... resize 600`) o servilo con `next/image`.
2. Mapa en `lib/stores.ts` (solo presentación): `{ norauto: '/logos/norauto.svg', naldo: '/logos/naldo.svg', neumaflores: '/logos/neumaflores.png', '360-neumaticos': '/logos/360-neumaticos.png' }`, mapeado por el slug/id de tienda que ya existe.
3. Componente `StoreLogo({ store, size='sm'|'md' })` con `next/image`, `alt={nombre}`, `className="h-5 md:h-6 w-auto object-contain"`; fallback = nombre en texto (no iniciales en cuadrado gris).
4. Usalo en: sección "Tiendas que comparamos" de la home (logo `h-8` centrado en caja `h-16`), tabla, cards mobile, CheapestCard ("Norauto" → logo) y barra CTA mobile.
5. Norauto trae su fondo azul propio: no lo pongas sobre otra caja de color; contenedor blanco.

### P7 — Secciones futuras vacías
- "Autos que usan esta medida": `return null` si no hay autos.
- "Medidas parecidas": solo si hay ≥ 2.
- Cualquier "Por auto (pronto)"/"Cuotas" en nav que lleve a una página sin datos: ocultar del nav hasta que exista.

### Cierre
1. `npm run build` y `npm run lint` sin errores.
2. Verificá en consola a 390 px: `document.documentElement.scrollWidth === 390` en home y /medida.
3. `node scripts/screenshots.mjs despues-05a` y mostrame antes/después + lista de archivos tocados.

### Checklist de aceptación
- [x] Sin scroll horizontal a 390 px (scrollWidth = 390) en home y /medida.
- [x] Header mobile con menú; un solo header, sin encimados.
- [x] Hero y buscador entran en la primera pantalla mobile con el botón visible.
- [x] La "R" aparece dentro de Rodado como `R 14`; separador `/` solo entre Ancho y Perfil.
- [x] Botón "Ver precios" azul pleno cuando está habilitado.
- [x] "Medidas populares" en grilla densa con "desde $", sin carrusel ni flecha.
- [x] Medidas en una sola línea en cards mobile (2 columnas).
- [x] Dark mode eliminado: sin `next-themes`, sin toggle, `rg "dark:"` sin resultados (fuera de `components/ui`).
- [x] Tabla desktop con anchos fijos, chips de cuotas sin desborde, "0/1 cuotas" sin chip.
- [x] Mobile: ofertas en cards completas, sin cortes.
- [x] Logos reales en home, tabla, cards, CheapestCard y CTA; fallback en texto.
- [x] Gráfico oculto con < 5 puntos; eje Y ajustado si hay datos.
- [x] Barra CTA mobile solo tras scrollear y sin tapar el footer.
- [x] Secciones sin datos ocultas.
- [x] Capturas antes/después en `screenshots/`.
