# Brief de producto

## Qué es
Comparador de precios de **cubiertas (neumáticos) por medida** en Argentina. El usuario pone su medida (ej. 175/65 R14) o su auto (ej. Chevrolet Onix) y ve: el precio más barato hoy, una tabla por tienda (efectivo / tarjeta / cuotas / colocación), y el historial de precios para saber si conviene comprar ahora.

Promesa: **"La medida exacta, el mejor precio de hoy y si el descuento es real."**

## Investigación (noviembre 2026)
### Demanda (autocompletado de Google, gl=ar — sin volúmenes verificados)
- **Medida + precio** (patrón más grande): 175/65 R14, 185/65 R15, 175/70 R13, 165/70 R13, 175/70 R14, 185/65 R14, 185/60 R15, 185/70 R14, 195/55 R15, 195/60 R15, 195/65 R15, 205/55 R16, 195/55 R16, 205/65 R15, 205/60 R16, 215/65 R16, 205/55 R17, 225/65 R17, 235/75 R15, 265/65 R17.
- **Por auto + versión/año**: Gol Trend/Power, Onix Joy/LT/LTZ, Cronos 1.3/1.8, Hilux (2008–2023), Peugeot 208 Feline/Allure/GT, EcoSport, Ranger, Amarok, S10.
- **Marca + medida**: "precio cubiertas fate 185 60 r15", "pirelli p7 195 65 r15", "pirelli scorpion 235 75 r15".
- **Cuotas**: "cubiertas en cuotas sin interés", 12/18/24 cuotas.
- **Baratas / ofertas / ciudad**: "175 65 r14 en córdoba", "más baratas en argentina".
- **Motos** (poco atendido): moto 110, 150, Motomel S2, Skua 150, Tornado 250, XR 150.

### Competencia
| Sitio | Qué hace | Huecos |
|---|---|---|
| Llantazo | Solo Mercado Libre, ~334 modelos de cubiertas, lista "más baratas primero" | Sin historial visible, sin autos, sin otras tiendas |
| MejoresCompras | Solo ML, ~204 modelos, historial diario desde mayo 2026, detecta "descuentos truchos" | Sin páginas por medida ni auto; mezcla kits x2/x4 con unidades |
| Pricely / Precialo | Comparadores genéricos | No especializados, sin auto→medida |
| Tiendas (Neumaflores, Norauto, CentralTire, Coscolla…) | Rankean en "precio cubiertas [medida]" | Una sola tienda cada una |
| Foros (Club Onix Prisma) | Rankean en "cubiertas para onix" | Contenido viejo (2020) |

**Nuestro diferencial**: multi-tienda (no solo ML) + página por medida + página por auto + cuotas y colocación + historial con "descuento real / inflado" + precio por unidad normalizado (kits divididos).

### Fuentes de datos (probadas 4/11/2026)
- Norauto y Naldo: API pública VTEX `/api/catalog_system/pub/products/search?ft=...` → JSON sin login.
- 360 Neumáticos: WooCommerce Store API `/wp-json/wc/store/products` → JSON.
- Neumaflores: HTML con JSON-LD de producto (2.398 neumáticos, 33 marcas).
- CentralTire, Coscolla, Direse, La Esquina del Neumático: HTML (fase posterior).
- Mercado Libre API `/sites/MLA/search`: **403 sin auth** → requiere app + OAuth (fase 3).

### Monetización
- Afiliados Mercado Libre: "hasta 15%" (especial lanzamiento); Clarín reporta ~8% directa / 4% indirecta en categorías generales. % exacto de neumáticos: verificar dentro del panel. Requiere monotributo tras 60 días.
- Leads a gomerías (destacado por ciudad, CPL) — probablemente lo más rentable.
- AdSense (RPM autos estimado US$1–3, sin verificar).
- **Escenario estimado** (50k visitas/mes al año 1): US$400–700/mes. Es una estimación, no un dato.

## Alcance
**MVP (Fase 1)**: home con buscador por medida, 10 páginas /medida con datos de EJEMPLO, diseño premium, SEO básico, deploy.
**Fase 2**: datos reales de 4 tiendas, historial, cron 2x/día.
**Fase 3**: /auto, /marca, /rodado, /cuotas, leads, afiliados, sitemap, analítica.
**Después**: motos, camionetas, alertas de precio por mail (Kit), más tiendas, ML API.
