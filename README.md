# Cubiertas MVP — comparador "precio de cubiertas por medida" (Argentina)

Esta carpeta tiene todo para construir el sitio con **Cursor**, paso a paso. Arrancamos simple (sitio lindo con datos de ejemplo) y después escalamos a datos reales.

## Cómo usarla en Cursor
1. Abrí Cursor → `File > Open Folder` → elegí esta carpeta (`cubiertas-mvp`). Cursor va a leer solo las reglas de `.cursor/rules/` (diseño + código).
2. Leé `00-brief.md` y `01-diseno/design-system.md` (5 minutos, vale la pena).
3. Abrí el chat en **modo Agent** y pegá los prompts de `02-prompts/` **en orden** (01, 02, 03…). Uno por vez.
4. Después de cada prompt, revisá el **checklist de aceptación** del final del archivo. Si algo no cumple, decile al Agent: "No cumple el punto X del checklist, corregilo".
5. Corré `npm run dev` y mirá el resultado en http://localhost:3000 (probalo también en el celular / modo responsive del navegador).
6. Hacé commit en git después de cada prompt que funcione (`git add . && git commit -m "prompt 03 ok"`). Así podés volver atrás.

## Fases
- **Fase 1 (01–05)**: sitio con datos de ejemplo, diseño premium, publicado en Vercel. Objetivo: ver cómo queda.
- **Fase 2 (06–09)**: base de datos Neon + scrapers Python (Scrapling) + cron en GitHub Actions + sitio leyendo datos reales.
- **Fase 3 (10–13)**: páginas por auto, marca, rodado, cuotas; leads a gomerías; afiliados Mercado Libre; SEO y analítica.

## Requisitos
- Node.js 20 LTS o superior (`node -v`)
- Python 3.11+ (`python3 --version`) — recién en Fase 2
- Git + cuenta de **GitHub**
- Cuenta de **Vercel** (login con GitHub)
- Cuenta de **Neon** (Postgres) — Fase 2
- Cursor instalado

## Costos (todo gratis para arrancar)
| Servicio | Plan | Costo |
|---|---|---|
| Vercel | Hobby | US$0 (uso no comercial según sus términos; cuando monetices conviene Pro, ~US$20/mes — verificar precio actual) |
| Neon | Free | US$0 (0,5 GB aprox., suficiente para años de snapshots) |
| GitHub Actions | Free | US$0 (repos públicos ilimitado; privados ~2.000 min/mes) |
| Dominio .com.ar | NIC Argentina | pago anual (verificar tarifa vigente en nic.ar) |

## Estructura
```
README.md              ← esto
00-brief.md            ← producto, investigación, alcance
01-diseno/design-system.md
02-prompts/01..13      ← prompts para Cursor
03-datos/              ← medidas semilla y mapeo autos→medida
.cursor/rules/         ← reglas que Cursor aplica siempre
```
