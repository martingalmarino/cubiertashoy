# Prompt 01 — Setup Next.js + tokens de diseño
**Objetivo**: proyecto base andando con el sistema de diseño aplicado.

## Pegá esto en Cursor (Agent)
```
Leé .cursor/rules/*, 00-brief.md y 01-diseno/design-system.md.
Creá en una subcarpeta `web/` un proyecto Next.js (última versión estable) con App Router, TypeScript estricto, Tailwind, ESLint y src/ NO (usar app/ en raíz de web/). Instalá shadcn/ui (init) y los componentes: button, select, card, badge, accordion, tooltip, tabs, table, skeleton. Instalá recharts y lucide-react.
Configurá los tokens del design-system como variables CSS en app/globals.css y mapealos en la config de Tailwind (colores asfalto, grafito, niebla, papel, ambar, verde, rojo, azul; radios sm/md/lg/xl; sombras sm/md/lg). Configurá shadcn para usar esos tokens.
Cargá Inter Tight, Inter y JetBrains Mono con next/font/google como variables (--font-display, --font-sans, --font-mono).
Creá lib/format.ts con formatARS(n) usando Intl es-AR sin decimales y con test simple.
Creá components/Logo.tsx ("cubiertas" + cápsula ámbar "hoy" en mono), components/Header.tsx y components/Footer.tsx (oscuro con textura de banda de rodadura en CSS: repeating-linear-gradient diagonal al 5%).
Creá una página /styleguide que muestre colores, tipografías, botones, badges y la medida "175/65 R14" en mono grande, para revisar el sistema.
html lang="es-AR", fondo papel.
```
## Checklist
- [ ] `cd web && npm run dev` abre sin errores.
- [ ] /styleguide muestra los 14 colores, 3 fuentes distintas, botones y badges.
- [ ] No hay colores de Tailwind por defecto usados en componentes.
- [ ] Header y footer se ven bien a 375px.
- [ ] `npm run build` y `npm run lint` pasan.
