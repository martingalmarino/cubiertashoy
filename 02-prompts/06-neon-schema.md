# Prompt 06 — Base de datos Neon Postgres
## Pasos manuales
Creá un proyecto en neon.tech (región más cercana: São Paulo si está disponible) y copiá el connection string a `web/.env.local` como DATABASE_URL (y en Vercel → Settings → Environment Variables). También podés instalar Neon desde el Marketplace de Vercel.
## Pegá esto en Cursor (Agent)
```
Creá db/schema.sql y migraciones (usá Drizzle ORM en web/) con:
- stores(id, slug, nombre, url, logo_url, plataforma ['vtex','woocommerce','html'], activo)
- sizes(id, slug UNIQUE '175-65-r14', ancho, perfil, rodado, label)
- products(id, store_id FK, external_id, url, marca, modelo, size_id FK, indice_carga, indice_velocidad, unidades_por_paquete INT default 1, titulo_original, activo, first_seen, last_seen, UNIQUE(store_id, external_id))
- price_snapshots(id, product_id FK, captured_at timestamptz, precio_unitario_efectivo INT, precio_unitario_tarjeta INT, precio_lista INT NULL, cuotas_sin_interes INT NULL, colocacion_incluida BOOL NULL, en_stock BOOL) con índice (product_id, captured_at desc)
- vista materializada size_daily_stats(size_id, dia, min, mediana, max, ofertas, tiendas)
- scrape_runs(id, store_id, started_at, finished_at, productos, errores, estado)
Script de seed que cargue sizes desde data/medidas.json y las 4 tiendas. Todos los precios enteros ARS por unidad.
```
## Checklist
- [ ] Migración corre contra Neon sin errores.
- [ ] `select count(*) from sizes` = cantidad del seed; 4 stores.
- [ ] DATABASE_URL no está commiteada.
