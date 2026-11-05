# Sistema de diseño — "Banda de rodadura"

## Concepto de marca
Un instrumento de precisión, no un catálogo de ofertas. Inspiración: el **flanco de una cubierta** (tipografía técnica en relieve, la medida como protagonista) + la **claridad de un tablero de auto**. Sensaciones: confiable, exacto, rápido, argentino sin cliché.
- La **medida** (175/65 R14) es el héroe visual: siempre en tipografía mono, grande, con el formato del flanco.
- Un motivo gráfico sutil: patrón de **banda de rodadura** (líneas diagonales repetidas) usado como textura en headers y separadores, al 4–6% de opacidad.
- Tono: directo, de vos, sin exageraciones. "Hoy la más barata está en Norauto." Nunca "¡¡OFERTÓN!!".

## Nombres / dominios (VERIFICAR disponibilidad en nic.ar antes de registrar)
1. **cubiertashoy.com.ar** — RDAP devolvió 404 (probablemente libre) — claro para SEO "precio cubiertas hoy".
2. **medidacubiertas.com.ar** — RDAP 404 (probablemente libre) — enfatiza la medida.
3. **tumedida.com.ar** — RDAP 404 (probablemente libre) — marca corta, extensible a motos.
Recomendado: **cubiertashoy.com.ar**. Logo: palabra "cubiertas" en Inter Tight 700 + "hoy" en mono dentro de una cápsula ámbar.

## Paleta
| Token | Hex | Uso |
|---|---|---|
| `asfalto-950` | `#0B0F14` | texto principal, header oscuro, footer |
| `asfalto-800` | `#1C232C` | superficies oscuras, chart tooltip |
| `asfalto-600` | `#3A4552` | texto secundario |
| `grafito-400` | `#8A96A3` | texto terciario, bordes fuertes |
| `niebla-200` | `#E3E7EB` | bordes, divisores |
| `niebla-100` | `#F1F3F5` | fondos de secciones |
| `papel` | `#FAFAF7` | fondo general (blanco cálido, no #FFF puro) |
| `ambar-500` | `#F5A524` | acento de marca (línea de señalización vial), CTA secundario, logo |
| `ambar-100` | `#FEF3DC` | fondo chips/destacados |
| `verde-600` | `#0F8A5F` | precio más bajo, "descuento real", baja de precio |
| `verde-50` | `#E7F6EF` | fondo badge real |
| `rojo-600` | `#D1432F` | "descuento inflado", suba de precio |
| `rojo-50` | `#FCECE9` | fondo badge inflado |
| `azul-600` | `#2457D6` | links, foco, CTA primario |
Contraste: texto sobre `papel` siempre ≥ 4.5:1 (asfalto-950/600 cumplen). Ámbar NUNCA como color de texto sobre claro (usar asfalto-950 sobre ámbar).
Modo oscuro: fase posterior; usar variables CSS desde el día 1.

## Tipografía (Google Fonts, vía `next/font`)
- **Inter Tight** (600/700) — títulos. Tracking -0.02em.
- **Inter** (400/500/600) — texto. `font-feature-settings: "tnum"` en números.
- **JetBrains Mono** (500/700) — medidas, precios grandes, índices de carga. Esto da el look "flanco".
Escala (mobile → desktop): display 40→64, h1 32→44, h2 24→30, h3 19→22, body 16, small 14, micro 12. Line-height títulos 1.1, texto 1.55.
Precios: siempre `$ 118.650` con punto de miles (es-AR), mono, tabular.

## Espaciado, radios, sombras
- Base 4px. Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Contenedor máx 1120px; padding lateral 16 (mobile) / 24 (tablet) / 32 (desktop).
- Radios: `sm 8px` (chips), `md 12px` (inputs, botones), `lg 16px` (cards), `xl 24px` (hero search), `full` (badges).
- Sombras (suaves, frías): `sm: 0 1px 2px rgba(11,15,20,.06)`; `md: 0 4px 16px -4px rgba(11,15,20,.10)`; `lg: 0 16px 40px -12px rgba(11,15,20,.18)`. Bordes 1px niebla-200 en lugar de sombras pesadas.

## Componentes
1. **MedidaSearch** (hero): 3 selects grandes en fila (Ancho / Perfil / Rodado) con separadores visuales "/" y "R" como en el flanco: `[175] / [65] R [14]` + botón "Ver precios". Selects dependientes (perfil filtra por ancho, rodado por ambos) desde el seed. Tab alternativo "Por auto" (deshabilitado con "Pronto" en Fase 1). Debajo: chips de medidas populares. Mobile: los 3 selects en una fila (son cortos), botón full width.
2. **CheapestCard**: card grande, borde verde-600 a la izquierda 4px. "Más barata hoy" micro-label, marca + modelo, precio en mono 40px, "por unidad", tienda, chip de cuotas, botón "Ir a la tienda →". Debajo: "Actualizado hace 3 h".
3. **PriceCard** (lista mobile): logo/inicial tienda, marca-modelo, índice "82T", precio efectivo grande, tarjeta chico, chips.
4. **StoreTable** (desktop ≥768px): columnas Tienda · Marca/Modelo · Índice · Efectivo · Tarjeta · Cuotas · Colocación · CTA. Ordenable por precio; fila más barata con fondo verde-50. En mobile se convierte en lista de PriceCards.
5. **PriceHistoryChart** (Recharts): línea de mediana diaria + banda min–máx en área suave, ejes minimalistas, tooltip oscuro asfalto-800, toggle 30/90/365 días. Línea de referencia punteada "mínimo histórico".
6. **DiscountBadge**: `Descuento real` (verde-50/verde-600, ícono check) / `Descuento inflado` (rojo-50/rojo-600, ícono alerta) con tooltip explicando el criterio (precio "antes" vs percentil 75 de 60–90 días).
7. **CuotasChip**: ámbar-100 + texto asfalto-950: "6 cuotas sin interés". Variante "Colocación gratis".
8. **ExampleDataBanner**: banda ámbar-100 arriba en Fase 1: "Datos de ejemplo — todavía no son precios reales."
9. **Breadcrumbs**, **FAQ** (acordeón shadcn), **Footer** oscuro con textura de rodadura.
10. **MedidaBadge**: la medida en mono dentro de una cápsula oscura, como sello.

## Wireframes
### Home `/`
```
┌──────────────────────────────────────────────┐
│ cubiertas[hoy]                    Medidas Autos│
├──────────────────────────────────────────────┤
│  (textura rodadura sutil)                      │
│  El mejor precio de tu cubierta, hoy.          │
│  Comparamos tiendas de todo el país.           │
│ ┌──────────────────────────────────────────┐ │
│ │ [Por medida] [Por auto · pronto]          │ │
│ │ [ 175 ▾ ] / [ 65 ▾ ] R [ 14 ▾ ]           │ │
│ │ [        Ver precios →               ]    │ │
│ │ ¿Dónde está tu medida? (ilustración flanco)│ │
│ └──────────────────────────────────────────┘ │
│ Populares: (175/65 R14)(185/65 R15)(205/55 R16)│
├──────────────────────────────────────────────┤
│ Medidas más buscadas — grid de cards:          │
│ [175/65 R14  desde $ 74.600  ↓2% semana]  ...  │
├──────────────────────────────────────────────┤
│ Cómo funciona: 1 medida · 2 comparás · 3 comprás│
│ Por qué confiar: tiendas, actualización, "real" │
├──────────────────────────────────────────────┤
│ FAQ                                           │
│ Footer oscuro                                 │
└──────────────────────────────────────────────┘
```
### `/medida/[slug]` (ej. /medida/175-65-r14)
```
Inicio › Medidas › 175/65 R14
[175/65 R14]  Precio de cubiertas 175/65 R14 hoy
12 ofertas en 4 tiendas · actualizado hace 3 h
┌ Más barata hoy ───────────────┐ ┌ Resumen ─────────┐
│ Firemax FM601 82T              │ │ Mediana $ 98.000 │
│ $ 74.606  por unidad           │ │ Mín 90d $ 71.200 │
│ Neumaflores · (6 cuotas)       │ │ Tendencia ↑ 3%   │
│ [ Ir a la tienda → ]           │ └──────────────────┘
└────────────────────────────────┘
Historial  [30d][90d][1a]   ~~~~~/\~~~__ (chart)
Todas las ofertas   ordenar: [Precio ▾]  filtros: marca, cuotas
│Tienda│Modelo│Índice│Efectivo│Tarjeta│Cuotas│Coloc.│ → │
Autos que usan esta medida: (Fiat Siena)(Berlingo)…
Medidas parecidas: 175/70 R14 · 185/65 R14
FAQ (JSON-LD)
```
### `/auto/[slug]` (ej. /auto/chevrolet-onix) — Fase 3
```
Inicio › Autos › Chevrolet Onix
Cubiertas para Chevrolet Onix: medidas y precios hoy
Elegí tu versión: (Joy)(LT)(LTZ)  año: [2018 ▾]
┌ Tu medida: [185/70 R14] ──────── desde $ 89.500 ┐
│ [Ver todas las ofertas 185/70 R14 →]            │
└──────────────────────────────────────────────────┘
Top 3 más baratas de tu medida (PriceCards)
"Verificá la medida en el flanco de tu cubierta" (ilustración)
Otras opciones de medida para el Onix · FAQ
```

## Microinteracciones
- Selects: al elegir, el siguiente select se enfoca solo; el botón se activa con un leve "pulse" ámbar.
- Precios: conteo animado corto (300ms) al cargar; respetar `prefers-reduced-motion`.
- Fila de tabla: hover eleva con sombra sm y muestra flecha del CTA.
- Chart: tooltip sigue al cursor; toggle de rango con transición de 200ms.
- Badges: tooltip on hover/tap con explicación.
- Skeletons con shimmer suave en vez de spinners.
- Duraciones 150–250ms, easing `cubic-bezier(.2,.8,.2,1)`.

## Accesibilidad
- WCAG 2.1 AA. Foco visible (anillo azul-600 2px + offset 2px).
- Selects nativos accesibles o Radix Select con labels reales ("Ancho en mm").
- Tablas con `<th scope>`; el chart tiene resumen textual ("El precio mínimo de 90 días fue…").
- Targets táctiles ≥ 44px. Nunca comunicar solo con color (badges con ícono + texto).
- `lang="es-AR"`, precios con `Intl.NumberFormat('es-AR')`.

## Referencias de buena UX de comparadores
- **Google Shopping / Flights**: insight de "precio bajo/alto para esta ruta" → nuestro resumen + badge.
- **Keepa / CamelCamelCamel**: gráfico de historial como prueba de confianza.
- **Tire Rack** (EE.UU.): búsqueda por medida o por vehículo, como dos tabs.
- **Idealo / Trivago**: tabla de tiendas limpia con la mejor fila destacada.
- **Linear / Stripe**: nivel de pulido tipográfico y espaciado que buscamos.
