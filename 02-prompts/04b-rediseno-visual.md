# Prompt 04b — Rediseño visual (estilo "comparador luminoso", inspirado en Precialo)

> Correlo ANTES del prompt 06. Es un prompt autocontenido: pegalo entero en Cursor (modo Agent).
> Referencias en `screenshots/`: `home-*.png` y `medida-*.png` (estado actual), `precialo-*.png` (inspiración de estructura y sensación; NO copiar marca, logo ni textos).

---

## PROMPT PARA CURSOR

Sos un diseñador/desarrollador frontend senior. Tenés que rediseñar visualmente **cubiertashoy** (Next.js App Router + TypeScript + Tailwind + shadcn/ui + Recharts) para que se vea como un comparador de precios argentino premium, claro y confiable, al nivel de pulido de Linear, Vercel o Stripe, y con la estructura de cajas y tarjetas de un comparador moderno como precialo.com.ar.

**Regla de oro: NO toques datos, tipos, lógica, rutas, metadata SEO, JSON-LD ni cálculos** (mediana, percentil 75, descuento real/inflado, cuotas). Solo presentación: clases, componentes visuales, tokens, animaciones y SVG.

### 0. Antes de empezar: capturas del "antes"
1. `npm i -D playwright && npx playwright install chromium`
2. Creá `scripts/screenshots.mjs`: abre `http://localhost:3000/` y `/medida/175-65-r14` a 1440×900 y 390×844 (isMobile), full page, y guarda en `screenshots/<antes|despues>/<pagina>-<ancho>.png`. El argumento `antes`/`despues` se pasa por CLI.
3. `npm run dev` y `node scripts/screenshots.mjs antes`.

### 1. Lenguaje visual (qué buscamos)
- Fondo general **gris azulado muy claro** (`#F4F5F9`) con **tarjetas blancas** con borde fino `#E5E7EB`, radio 16 y sombra casi nula. Es lo que le da a Precialo ese aire ordenado de "cajas".
- **Bloques de color pastel** para agrupar secciones (franjas con gradiente suave que contienen chips blancos). Esto reemplaza nuestras secciones planas.
- Texto casi negro azulado, no negro puro. Un solo color de acción (azul) y un color fuerte para descuentos.
- Aire: secciones con `py-16 md:py-24`, contenido `max-w-6xl`.
- Densidad alta en tarjetas de precio (mucha información chica y bien jerarquizada), pero con mucho espacio alrededor.

### 2. Tokens (reemplazá `tailwind.config.ts` → `theme.extend` y las variables CSS de shadcn en `globals.css`)
```ts
colors: {
  fondo: '#F4F5F9',          // body
  superficie: '#FFFFFF',     // cards
  borde: '#E5E7EB',
  'borde-fuerte': '#D1D5DB',
  tinta: { 900: '#101828', 700: '#1D2939', 500: '#667085', 400: '#98A2B3' },
  accion: { 600: '#3E6AE1', 700: '#2F55C4', 50: '#EEF2FD' },   // CTA, links, foco
  oferta: { 600: '#CC0C39', 50: '#FDECEF' },                    // % OFF, precio tachado
  ahorro: { 600: '#0F8A5F', 50: '#E7F5EB' },                    // "más barato hoy", descuento real
  ambar:  { 500: '#F5A524', 100: '#FEF3DC' },                   // marca "hoy", cuotas
  pastel: {
    lila: '#F3E8FF', rosa: '#FCE7F3', menta: '#DCFCE7',
    cielo: '#E0F2FE', limon: '#FEF9C3'
  },
  asfalto: { 950: '#0B0F14', 800: '#1C232C' }                   // bloques oscuros puntuales
},
borderRadius: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
boxShadow: {
  card: '0 1px 2px rgba(16,24,40,.05)',
  'card-hover': '0 10px 15px -3px rgba(16,24,40,.08), 0 4px 6px -4px rgba(16,24,40,.06)',
  hero: '0 18px 40px -28px rgba(10,20,80,.55)'
},
fontFamily: {
  sans: ['var(--font-inter)'],
  display: ['var(--font-display)'],   // Big Shoulders Display o Archivo Black via next/font (solo titulares de campaña/hero)
  mono: ['var(--font-mono)']          // JetBrains Mono: medidas y precios
}
```
Gradientes de sección (definilos como utilidades en `globals.css`):
- `.grad-lila` → `linear-gradient(90deg,#F0ABFC 0%,#C4B5FD 100%)` (con chips blancos encima)
- `.grad-menta` → `linear-gradient(90deg,#67E8F9 0%,#4ADE80 100%)`
- `.grad-suave` → `linear-gradient(180deg,#FDF2F8 0%,#F4F5F9 60%)` (detrás del hero, con una onda SVG verde/rosa muy tenue)

### 3. Escala tipográfica
| Uso | Clase |
|---|---|
| Hero H1 | `font-sans font-semibold text-[40px] leading-[1.05] tracking-[-0.03em] md:text-[64px] text-tinta-900` |
| Medida gigante | `font-mono font-bold text-[56px] md:text-[96px] tracking-[-0.04em] tabular-nums` |
| H2 sección | `text-xl md:text-2xl font-semibold tracking-[-0.02em]` |
| Título card | `text-sm font-medium text-tinta-700 line-clamp-2` |
| Precio grande | `font-mono text-[32px] md:text-[44px] font-bold tabular-nums` |
| Precio card | `font-mono text-lg font-bold tabular-nums` |
| Meta / eyebrow | `text-[11px] uppercase tracking-[0.08em] text-tinta-500 font-medium` |
Siempre `tabular-nums` en números. Precios con `$ 78.300` (espacio fino `\u202F` entre $ y número).

### 4. Componentes (cambios concretos)

**Header**: blanco, `h-16`, borde inferior `borde`, sticky con `backdrop-blur bg-white/80`. Logo "cubiertas" + pastilla ámbar "hoy". En desktop, la **barra de búsqueda compacta** en el header (aparece al scrollear pasado el hero). Botón tema (sol/luna) en pastilla gris.

**Hero (home)**:
- Fondo `.grad-suave` + motivo SVG: **arco de flanco de cubierta** (semicírculo grueso `asfalto-800` con dibujo de banda de rodadura en patrón repetido de chevrons) asomando abajo a la derecha, opacidad 8–12%. Hacé el SVG a mano en `components/visual/TreadPattern.tsx` (`<pattern>` de chevrons 24×24) y `SidewallArc.tsx`.
- H1 centrado: "El mejor precio de tu cubierta, **hoy**." ("hoy" en subrayado ámbar dibujado con SVG).
- Subtítulo: "Comparamos N tiendas de Argentina. Elegí tu medida y listo." con **N en negrita**.
- **Buscador estilo pill** (lo central de la inspiración): contenedor `rounded-full bg-white border border-accion-600/40 shadow-hero h-14 md:h-16 px-2`, adentro tres segmentos (Ancho / Perfil / Rodado) separados por `/` y `R` en mono grande, cada uno un `Select` sin borde. A la derecha, botón circular `accion-600` con ícono de lupa. En mobile el pill se vuelve tarjeta `rounded-2xl` con los 3 selects en fila y el botón abajo full-width.
- Debajo del buscador: tabs "Por medida | Por auto (pronto)" como pastillas chicas.
- **Fila de 3 trust-items** (ícono en círculo con borde + 2 líneas): "+N tiendas / precios actualizados", "Monitoreo diario / cada 24 h", "Historial 90 días / descuento real". (Estilo exacto de la fila bajo el buscador de la referencia.)
- **Preview de medida**: a la derecha en desktop (o debajo en mobile), una tarjeta oscura `asfalto-950 rounded-xl` con la medida elegida en **mono gigante** (`175/65 R14`), y debajo un diagrama SVG del flanco señalando dónde se lee cada número ("¿Dónde está tu medida?"). Al cambiar un select, el número cambia con animación (ver §6).

**Banda "Medidas populares"**: bloque `.grad-lila rounded-xl p-4 md:p-6` con título blanco/oscuro + chips blancos `rounded-md px-4 h-11 font-mono font-semibold` scrolleables horizontalmente (snap) con flecha circular a la derecha.

**MedidaCard (grilla "Medidas más buscadas")**: `bg-white border rounded-lg p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition`. Contenido:
1. Mini-ícono SVG de cubierta + medida mono `text-lg`.
2. Eyebrow "desde".
3. Precio mono bold.
4. Fila: chip de variación semanal (`ahorro-50/ahorro-600` si baja ↓, `oferta-50/oferta-600` si sube ↑) + "N tiendas".
5. Sparkline de 30 días (Recharts `<Line>` 40px alto, sin ejes, color según tendencia).
Grilla: `grid-cols-2 md:grid-cols-4 gap-3 md:gap-4` (en mobile 2 columnas, no 1).

**Bloques "pastel" de valor** (reemplazan "Cómo funciona" y "Por qué confiar"): 3 tarjetas grandes `rounded-xl p-6` con fondos `pastel.limon`, `pastel.menta`, `pastel.cielo`; ícono en cuadrado blanco, título, texto corto, y una "caja interna" blanca/translúcida con un dato destacado (ej. "Hoy hay **14 ofertas** con descuento real"), flecha circular abajo.

**Tiendas**: fila de tarjetas blancas con logo en cuadrado `rounded-md border` (placeholder con iniciales si no hay logo), nombre, y caja gris interna "N ofertas →". Cada tienda solo si existe en los datos.

**Página /medida/[slug]**:
- Breadcrumb chico. Encabezado: chip oscuro con la medida mono, H1, meta "18 ofertas en 4 tiendas · actualizado hace 1 h" con punto verde pulsante.
- **CheapestCard ("Más barato hoy")**: tarjeta destacada `rounded-xl border-2 border-ahorro-600 bg-white`, con ribbon superior `bg-ahorro-600 text-white text-xs` "MÁS BARATO HOY". Layout: izquierda marca/modelo + índice; centro precio mono 44px, precio "antes" tachado `text-oferta-600 line-through` + badge `% OFF` rojo **solo si el descuento es real** (si es inflado, badge ámbar "Descuento inflado" con tooltip explicando el p75); caja gris interna con "Precio en efectivo / Precio con tarjeta" lado a lado (como el "Precio anterior / Precio más actual" de la referencia); chip de cuotas; CTA `accion-600 rounded-full h-12` "Ir a {tienda} ↗"; debajo "Actualizado hace X".
- **Resumen** (columna derecha, sticky en desktop): tarjeta con mediana hoy, mínimo 90 días, tendencia, y un mini "termómetro" horizontal que ubica el precio más barato entre mín y máx de 90 días.
- **PriceHistoryChart**: tarjeta blanca, toggle 30/90/180 como segmented control pill, área con gradiente `accion-600` 20%→0%, línea 2px, banda p25–p75 en `accion-50`, línea punteada de mínimo, grid horizontal `borde` punteado, tooltip tarjeta blanca con sombra y precio mono. Ejes `text-tinta-400 text-xs`.
- **StoreTable**: desktop = tabla en tarjeta con header sticky `bg-fondo text-[11px] uppercase`, filas `h-16`, hover `bg-fondo`, fila #1 con borde izquierdo verde de 3px; columnas de precio alineadas a la derecha en mono. **Mobile = lista de tarjetas** (no tabla): cada oferta es una card con tienda (avatar iniciales), modelo, precio grande, chips (cuotas, colocación, descuento) y botón "Ver" circular.
- Ordenar: segmented control pill "Efectivo | Tarjeta | Cuotas".
- "Autos que usan esta medida" y "Medidas parecidas": chips blancos con borde, mono para medidas.
- FAQ: acordeón en tarjeta única con divisores, `+` que rota a `×`.

**Footer**: mantener oscuro `asfalto-950` pero con 4 columnas, patrón de banda de rodadura SVG muy tenue de fondo, y el aviso de datos de ejemplo.

**ExampleDataBanner**: más discreto: pastilla ámbar centrada bajo el header ("Datos de ejemplo · todavía no son precios reales"), no una franja completa.

### 5. Estados
- **Loading**: `loading.tsx` en `/` y `/medida/[slug]` con skeletons que imitan exactamente las cards (shimmer `bg-gradient-to-r from-niebla via-white to-niebla animate-[shimmer_1.4s_infinite]`).
- **Vacío** (medida sin ofertas): tarjeta centrada con ilustración SVG de cubierta "pinchada" (línea discontinua), texto "Todavía no tenemos precios para 175/65 R14", CTA "Avisame cuando haya" (deshabilitado/placeholder si no hay backend aún) y chips de medidas parecidas.
- **404 de medida**: misma estética, con el buscador pill.
- **Error**: `error.tsx` con botón "Reintentar".

### 6. Animación (framer-motion, `npm i framer-motion`)
- Entrada de secciones: `initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:.4,ease:[.2,.8,.2,1]}}`; grillas con `staggerChildren: .04`.
- Medida gigante del hero: cada dígito en `AnimatePresence` con slide vertical (efecto odómetro) al cambiar selects.
- Precio de CheapestCard: count-up de 0 al valor en 600 ms al montar (solo primera vez).
- Cards: `whileHover={{y:-2}}`; botones `whileTap={{scale:.97}}`.
- SidewallArc: rotación lenta infinita (60 s/vuelta) del patrón.
- Respetá `useReducedMotion()`: si está activo, sin movimiento, solo opacidad.

### 7. Dark mode
- `next-themes` con `class`. Default: sistema. Toggle en header.
- Dark: fondo `#0B0F14`, superficie `#121821`, borde `#232B36`, tinta 900 → `#F2F4F7`, tinta 500 → `#98A2B3`; pasteles pasan a versiones con 12% de opacidad sobre superficie; gradientes de sección al 25% de opacidad con texto claro; acción `#6C8DF0`.
- Verificá contraste AA en precios, chips y badges en ambos temas.

### 8. Mobile-first
- Diseñá primero a 390 px: buscador como tarjeta, grilla 2 columnas, chips scroll horizontal con snap, tabla → cards, CTA "Ir a la tienda" del más barato también como **barra fija inferior** (`fixed bottom-0 safe-area`) en /medida al scrollear pasada la CheapestCard.
- Targets táctiles ≥ 44 px. Nada de texto < 12 px.

### 9. Accesibilidad y performance
- Foco visible `ring-2 ring-accion-600 ring-offset-2`. Selects con label (visualmente oculto si hace falta).
- SVG decorativos con `aria-hidden`. Lighthouse móvil ≥ 90 en Performance y Accesibilidad. Fuentes vía `next/font` con `display: swap`. framer-motion solo en componentes cliente chicos (no conviertas páginas enteras a client).

### 10. Cierre: capturas del "después"
`node scripts/screenshots.mjs despues` y mostrame lado a lado antes/después de las 4 capturas. Listá qué archivos tocaste.

### Checklist de aceptación
- [ ] Datos, cálculos, rutas, SEO y JSON-LD idénticos (diff solo en UI/estilos/componentes visuales).
- [ ] Fondo `#F4F5F9` + cards blancas con borde, radios 12/16/24 consistentes.
- [ ] Buscador pill con 3 segmentos y botón circular; versión tarjeta en mobile.
- [ ] Hero con medida mono gigante animada + SVG de flanco/banda.
- [ ] Fila de 3 trust-items bajo el buscador.
- [ ] Al menos 1 banda con gradiente y chips (medidas populares) y 3 bloques pastel.
- [ ] MedidaCard con sparkline y chip de variación; 2 columnas en mobile.
- [ ] CheapestCard con ribbon "MÁS BARATO HOY", efectivo vs tarjeta, badge real/inflado correcto.
- [ ] Gráfico con área en gradiente, banda p25–p75, tooltip prolijo.
- [ ] Tabla en desktop, cards en mobile, barra CTA fija en mobile.
- [ ] Skeletons, estado vacío, 404 y error diseñados.
- [ ] Dark mode completo y contraste AA.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Capturas antes/después en `screenshots/`.
- [ ] Sin logo, textos ni marca de Precialo; solo inspiración de estructura.
