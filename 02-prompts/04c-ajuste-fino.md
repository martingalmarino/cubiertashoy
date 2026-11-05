# Prompt 04c — Ajuste fino post-rediseño (bugs + pulido)

> Correlo después de 04b y antes de 06. Pegalo entero en Cursor (modo Agent).
> Capturas de referencia del estado actual: `screenshots/v2/`.

---

## PROMPT PARA CURSOR

Aplicamos el rediseño 04b y quedaron bugs visuales y falta de pulido. Arreglá **en este orden de prioridad**. **No toques datos, cálculos, rutas, SEO ni JSON-LD.** Antes de empezar, corré `node scripts/screenshots.mjs antes-04c`.

### P1 — Hero nuevo: centrado, limpio, el buscador es el protagonista (DECISIÓN TOMADA)
1. **Eliminá por completo** la tarjeta oscura "TU MEDIDA" (con el `175/65 R14` y el diagrama de arco/flanco) y el **arco gris gigante / banda de rodadura** de fondo que se sale por el borde derecho. Borrá los componentes `SidewallArc`, el preview de medida y cualquier SVG decorativo grande del hero (y sus imports). Agregá `overflow-x-clip` en `<body>` para que ningún decorativo genere scroll horizontal.
2. **Eliminá la fuente display/stencil en todo el sitio** (Big Shoulders u otra condensada; es la que renderiza la medida rota tipo "JEJE R14"). Sacala de `next/font`, de `tailwind.config` (`fontFamily.display`) y reemplazá cada `font-display` por `font-sans font-semibold`. Las medidas y precios usan **solo** `font-mono` (JetBrains Mono, pesos 500/600/700 cargados explícitamente con `subsets:['latin']`).
3. Layout nuevo del hero (una sola columna, centrado):
   - Contenedor: `mx-auto max-w-3xl px-4 pt-16 pb-14 md:pt-24 md:pb-20 text-center`.
   - Fondo: solo el degradé suave `.grad-suave` (rosa muy tenue → `#F4F5F9`). Nada más.
   - H1: `text-[40px] leading-[1.05] md:text-[64px] font-semibold tracking-[-0.03em] text-tinta-900`. Mantener el subrayado ámbar en "hoy".
   - Subtítulo: `mt-4 text-base md:text-lg text-tinta-500`.
   - Tabs "Por medida / Por auto (pronto)": `mt-8`, pastillas `h-9 px-4 text-sm`.
   - **Buscador pill** (protagonista): `mt-4 mx-auto w-full max-w-2xl h-16 md:h-[72px] rounded-full bg-white border border-borde-fuerte shadow-hero pl-6 pr-2 flex items-center gap-2 focus-within:border-accion-600 focus-within:ring-4 focus-within:ring-accion-600/15`.
   - Debajo: línea chica `mt-3 text-sm text-tinta-500`: "Ej.: <span class='font-mono font-semibold text-tinta-700'>175/65 R14</span> — está en el flanco de tu cubierta" (link a "¿Dónde la encuentro?" que abre un popover con una imagen simple, opcional).
   - Trust row debajo (`mt-10`), ver P4.

### P2 — Buscador: placeholders rotos `_ / _ R _`
- Cada segmento es un `Select` con **label visible arriba** (`text-[11px] uppercase tracking-[0.08em] text-tinta-500`) y **valor/placeholder grande**: `font-mono text-xl md:text-2xl font-semibold`.
- Placeholder real por segmento: `175`, `65`, `14` en `text-tinta-400` (nunca `_` ni `–`).
- Separadores `/` y `R` en `font-mono text-xl md:text-2xl text-tinta-400`, alineados a la línea base del valor.
- Cada segmento `min-w-[88px] md:min-w-[120px] text-left`, con divisor `border-l border-borde` entre segmentos.
- Botón: `h-12 md:h-14 px-5 md:px-6 rounded-full bg-accion-600 text-white font-medium` con lupa + texto "Ver precios" (en desktop también; un círculo vacío de color apagado parece deshabilitado). Si falta algún valor: `opacity-60` + tooltip "Elegí ancho, perfil y rodado", nunca un azul lavado sin explicación.
- **Mobile (<640px)**: tarjeta `rounded-2xl p-4`, 3 segmentos en `grid grid-cols-3 gap-2`, cada uno `h-14 rounded-xl bg-fondo`, botón full-width `h-12` abajo.
- **Buscador compacto del header**: hoy aparece de golpe sobre el contenido y se ve encimado. Mostralo solo en `md:` cuando el hero salió de pantalla (IntersectionObserver), con fade `opacity 0→1` y `max-w-md h-10`. Misma corrección de placeholders.

### P3 — Botones oscuros circulares flotando en el borde derecho, repetidos
- Buscá cualquier elemento `fixed` o `sticky` fuera del header (scroll-to-top, toggle de tema duplicado, flechas de carrusel con `position:fixed`, botones de `framer-motion` con `layout`). Debe existir **un solo** toggle de tema, dentro del header.
- Las flechas de los carruseles ("Medidas populares", tiendas) van `absolute` dentro de su contenedor `relative`, nunca `fixed`.
- Si hay un "volver arriba", eliminalo.
- Verificá con `document.querySelectorAll('*')` filtrando `position: fixed` en consola: en home solo debe quedar el header (y en /medida la barra CTA inferior de mobile).

### P4 — Trust row: íconos diminutos
- `grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left`.
- Ícono en `size-11 rounded-full bg-white border border-borde grid place-items-center` con lucide `size-5 text-tinta-700`.
- Título `text-sm font-semibold text-tinta-900`, bajada `text-sm text-tinta-500`.

### P5 — Espacios vacíos enormes entre secciones
- Causa probable: animaciones `whileInView` con `initial opacity:0` (en capturas y en carga sin scroll quedan **huecos en blanco**) + `py-24` apilados. Arreglo:
  - Ritmo único: cada sección `py-12 md:py-16`; entre título y contenido `mt-6`. Nada de `mt-24`/`mb-24` sumados al padding.
  - Animaciones: `initial={{opacity:0,y:8}}` **solo si** `!prefersReducedMotion`, con `viewport={{once:true, amount:0.1}}`; el contenido above-the-fold sin animación de entrada. El HTML del servidor debe ser visible sin JS (no dejar `opacity:0` inline en SSR: usar `initial={false}` en los bloques críticos o animar con CSS `@starting-style`).

### P6 — "Medidas populares": chips chicos
- Chips: `h-12 px-5 rounded-xl bg-white text-base font-mono font-semibold text-tinta-900 shadow-card hover:shadow-card-hover hover:-translate-y-0.5`.
- Banda: `p-5 md:p-6`, título `text-lg font-semibold`, subtítulo `text-sm text-tinta-700/80`.
- En mobile, scroll horizontal `flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scrollbar-none` con fade en el borde derecho.

### P7 — Sparklines apagadas y MedidaCard
- Sparkline: alto `h-10`, `strokeWidth={2}`, color pleno (`ahorro-600` / `oferta-600` / `tinta-400` si es "→"), área debajo con gradiente del mismo color 18%→0%, punto final `r=2.5`.
- Precio: `font-mono text-xl font-bold` (hoy es muy chico respecto del título de medida). Medida `text-base font-mono font-semibold`.
- Chip de variación: `h-6 px-2 text-xs font-semibold rounded-md`.
- Ícono de cubierta de la card: `size-8 rounded-lg bg-fondo`.
- Padding card `p-5`, `gap-4` en grilla.

### P8 — "Cómo funciona": cajas internas débiles
- Caja interna: `mt-5 rounded-xl bg-white/80 ring-1 ring-black/5 px-4 py-3 text-sm` con el dato en `font-semibold text-tinta-900` y un número destacado en `font-mono text-lg`.
- Título card `text-lg font-semibold`, ícono `size-11 rounded-xl bg-white shadow-card`.
- Flecha inferior: `size-10 rounded-full bg-white shadow-card`, alineada a la izquierda con el texto (`mt-5`).
- Misma altura en las 3 (`h-full flex flex-col`, caja + flecha empujadas con `mt-auto`).

### P9 — Tiendas: placeholders grises con iniciales
- Agregá logos reales en `public/logos/{norauto,naldo,neumaflores,360-neumaticos}.svg|png` (bajalos del sitio de cada tienda, versión chica; si no conseguís alguno, usar wordmark de texto con su color de marca).
- Contenedor de logo `h-12 w-full grid place-items-center` dentro de la card, `object-contain max-h-8`.
- El texto interno ("N ofertas") hoy se ve cortado/ilegible: caja `mt-4 rounded-lg bg-fondo px-3 py-2 flex items-center justify-between text-sm` con número `font-mono font-semibold` y flecha circular `size-8`.
- Grilla `grid-cols-2 md:grid-cols-4 gap-3`.

### P10 — /medida: detalles
- El chip negro de la medida ocupa **todo el ancho** (barra negra larga): debe ser `inline-flex w-auto h-7 px-3 rounded-full`.
- CheapestCard: la fecha "Actualizado hace 3 h" contradice "actualizado hace 1 h" del encabezado; usá la misma fuente de verdad (solo formato, no lógica nueva). CTA `h-12 px-6` y en mobile `w-full`.
- Termómetro del resumen: barra `h-2 rounded-full bg-fondo` con tramo coloreado y marcador `size-3.5` con borde blanco; hoy casi no se ve.
- Gráfico: eje Y que arranque cerca del mínimo (`domain={['dataMin - 5%','dataMax + 5%']}`) para que la línea no quede aplastada arriba; etiquetas `$ 105 k` en mono `text-xs`.
- Mobile: la barra CTA fija inferior aparece encima de la primera pantalla; mostrala **solo** cuando la CheapestCard salió del viewport. Y agregá `pb-24` al `<main>` para que no tape el último contenido.
- Mobile: las cards de oferta están bien, pero dales `p-4 gap-3` y precio `text-xl`.

### P11 — Contraste y consistencia general
- Textos grises sobre `#F4F5F9`: mínimo `text-tinta-500` (#667085); nada en `tinta-400` salvo placeholders.
- Banner "Datos de ejemplo": `mt-3` y `text-xs`, que no empuje el hero (ya está bien de estilo).
- Alinear todos los contenedores a `max-w-6xl px-4 md:px-6` (hoy hero y secciones tienen anchos distintos).
- Revisar dark mode con todas las piezas nuevas.

### Cierre
1. `npm run build` sin warnings nuevos.
2. `node scripts/screenshots.mjs despues-04c` (home y `/medida/175-65-r14`, 1440 y 390, full page, **scrolleando la página antes de capturar** para disparar animaciones: `for (y) window.scrollBy(0,400)`), y además capturas recortadas de hero, buscador y grilla de cards.
3. Mostrame antes/después y la lista de archivos tocados.

### Checklist de aceptación
- [ ] No existe la tarjeta "TU MEDIDA" ni el arco gris; no hay scroll horizontal a 390 px.
- [ ] Cero usos de fuente display/stencil; medidas legibles en JetBrains Mono en todo el sitio.
- [ ] Hero centrado de una columna; el buscador pill es lo más grande y visible después del H1.
- [ ] Placeholders `175 / 65 R 14` grandes y grises; sin `_` ni `–`.
- [ ] Botón "Ver precios" con texto y estado deshabilitado explicado.
- [ ] Un solo toggle de tema; ningún botón flotante en el borde derecho.
- [ ] Trust row con íconos de 44 px.
- [ ] Sin huecos en blanco: secciones `py-12 md:py-16` y contenido visible sin JS/scroll.
- [ ] Chips de medidas `h-12 text-base`.
- [ ] Sparklines visibles (2 px, color pleno, área).
- [ ] Cajas internas de "Cómo funciona" con contraste y misma altura de cards.
- [ ] Logos reales (o wordmarks) en tiendas, texto legible.
- [ ] Chip de medida en /medida no ocupa todo el ancho; CTA fija mobile solo tras scrollear.
- [ ] Capturas antes/después en `screenshots/`.
