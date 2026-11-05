# Prompt 05 — Deploy en Vercel
## Pasos manuales primero
1. Creá un repo en GitHub (privado) y subí el proyecto (`git init`, `git remote add origin ...`, `git push`).
2. En vercel.com → Add New Project → importá el repo → **Root Directory: `web`** → Deploy.
## Pegá esto en Cursor (Agent)
```
Prepará el proyecto para Vercel: verificá que `npm run build` pase sin warnings, agregá .env.example (vacío por ahora, con NEXT_PUBLIC_SITE_URL), usá NEXT_PUBLIC_SITE_URL en canonical/sitemap/OG con fallback a VERCEL_URL. Agregá en el README de web/ cómo correr y deployar. Sin cambios de diseño.
```
## Checklist
- [ ] El deploy de Vercel está en verde y la URL .vercel.app abre.
- [ ] Probado en tu celular real (no solo emulador).
- [ ] El banner "Datos de ejemplo" sigue visible (todavía no hay datos reales).
- [ ] Compartiste el link con 2–3 personas para feedback de diseño. **Fin de Fase 1.**
