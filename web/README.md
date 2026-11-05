# cubiertas hoy (web)

Comparador de precios de cubiertas por medida — Fase 1 con datos de ejemplo.

## Requisitos

- Node.js 20+
- npm

## Correr en local

```bash
cd web
cp .env.example .env.local   # opcional
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Scripts útiles:

```bash
npm run lint
npm run build
npm test
npm start   # sirve el build de producción
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica (sin slash final). Usada en canonical, sitemap y OG. |
| `VERCEL_URL` | La setea Vercel sola; si no hay `NEXT_PUBLIC_SITE_URL`, se usa `https://$VERCEL_URL`. |

Ejemplo `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

En producción (Vercel), podés dejar `NEXT_PUBLIC_SITE_URL` vacío hasta tener dominio propio, o setearla a la URL `.vercel.app` / dominio final.

## Deploy en Vercel

1. Repo: [github.com/martingalmarino/cubiertashoy](https://github.com/martingalmarino/cubiertashoy)
2. En Vercel → **Add New Project** → importá el repo.
3. **Root Directory: `web`** (importante: el Next.js vive en esa carpeta).
4. Framework: Next.js (autodetectado). Build: `npm run build`. Output: default.
5. Env (opcional): `NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app`
6. Deploy.

CLI (desde esta carpeta):

```bash
cd web
npx vercel          # preview
npx vercel --prod   # producción
```

## Estructura

- `app/` — rutas (App Router)
- `components/` — UI
- `lib/` — datos, formato, medida
- `data/` — JSON de ejemplo (Fase 1)
