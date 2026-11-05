# Prompt 07 — Scrapers Python (Scrapling)

## Verificación de endpoints (hecha el 4/11/2026, 22:2x hora Argentina)
- `https://www.norauto.com.ar/api/catalog_system/pub/products/search?ft=175/65&_from=0&_to=4` → **HTTP 206, JSON, 5 productos** (ej. "Neumático Maxisport 175/65 R14 82T", Price 118649.99 en `items[0].sellers[0].commertialOffer.Price`). Sin login.
- `https://www.naldo.com.ar/api/catalog_system/pub/products/search?ft=175/65&_from=0&_to=4` → **HTTP 206, JSON, 5 productos**, pero el primero fue "Cubierta Corven 175/70R13" → la búsqueda `ft` es difusa: **siempre filtrar con el parser de medida**.
- `https://360neumaticos.com.ar/wp-json/wc/store/products?search=175&per_page=2` → **HTTP 200, JSON**.
- Neumaflores: HTML con JSON-LD de producto (colección `/collections/neumaticos-auto`).
- VTEX pagina de a máx. 50 (`_from`/`_to`) y suele cortar en 2.500 resultados por query: iterar por medida.

## Pegá esto en Cursor (Agent)
```
Creá /scrapers (Python 3.11, uv o venv, requirements: scrapling, psycopg[binary], pydantic, tenacity, pytest).
- parser.py: parse_titulo(titulo) -> {ancho, perfil, rodado, indice_carga, indice_velocidad, unidades_por_paquete}. Regex tolerante: "175/65R14 82T", "175/65 R14", "175 65 14", "175-65-14", "P 205/55r16 91 V". Detectar kits: "kit 2", "x2", "x 4", "kit de 4", "juego de 4" -> unidades_por_paquete. Tests con 25+ títulos reales (usá los de las respuestas de las APIs).
- base.py: clase Scraper con fetch cortés (User-Agent "cubiertashoy-bot/0.1 (+url contacto)", 1 request cada 2.5 s por tienda, timeout 20 s, reintentos tenacity con backoff, respetar robots.txt) y método save() que hace upsert de products y agrega price_snapshot.
- vtex.py (Norauto, Naldo): por cada medida del seed, GET /api/catalog_system/pub/products/search?ft={ancho}/{perfil}&_from=0&_to=49 (paginar), quedarse solo con productos cuyo parser coincida EXACTO con la medida; precio = commertialOffer.Price; lista = ListPrice; stock = AvailableQuantity>0; cuotas = mayor NumberOfInstallments sin interés en Installments si existe.
- woo.py (360 Neumáticos): GET /wp-json/wc/store/products?search={ancho}&per_page=100&page=N; precios vienen en minor units (prices.price / 10**currency_minor_unit).
- neumaflores.py: Scrapling (Fetcher/StealthyFetcher solo si hace falta) sobre la colección paginada; leer JSON-LD Product/Offer; efectivo y tarjeta del HTML.
- Normalizar SIEMPRE a precio por unidad (precio / unidades_por_paquete).
- run.py --store all|norauto|... --dry-run (imprime en vez de guardar). Registra scrape_runs.
```
## Checklist
- [ ] `python run.py --store norauto --dry-run` lista productos solo de la medida pedida.
- [ ] Tests del parser pasan (incluye kits x2/x4).
- [ ] Una corrida real llena price_snapshots para las 4 tiendas.
- [ ] Ninguna tienda recibe más de 1 request cada 2 s.
