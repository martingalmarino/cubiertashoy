# Prompt 03 — Página /medida/[slug]
**Objetivo**: la página que va a rankear en Google. Debe ser la más linda del sitio.

## Pegá esto en Cursor (Agent)
```
Creá app/medida/[slug]/page.tsx (Server Component) con generateStaticParams desde getMedidas(). 404 si la medida no existe.
Según el wireframe del design-system: breadcrumbs; MedidaBadge + H1 "Precio de cubiertas 175/65 R14 hoy"; subtítulo "N ofertas en M tiendas · actualizado hace X"; CheapestCard (la oferta más barata en efectivo) con borde verde, precio mono grande, CuotasChip, botón "Ir a la tienda"; card Resumen (mediana, mínimo 90 días, tendencia 30 días con flecha verde/roja).
PriceHistoryChart (client, Recharts): línea de mediana + área min–máx, tooltip oscuro, toggle 30/90/180 días, línea punteada del mínimo, resumen textual accesible debajo.
StoreTable en desktop (≥768px) y lista de PriceCard en mobile; ordenable por precio efectivo/tarjeta; fila más barata resaltada; DiscountBadge "Descuento real"/"Descuento inflado" cuando haya precio anterior (regla: inflado si precio_anterior > percentil 75 del historial de 90 días).
Secciones "Autos que usan esta medida" (desde 03-datos/autos-medidas.csv convertido a JSON, solo filas no TODO), "Medidas parecidas" (mismo rodado, ±10 ancho o ±5 perfil) y FAQ.
Skeletons mientras carga el chart.
```
## Checklist
- [ ] /medida/175-65-r14 se ve completa; /medida/999-99-r99 da 404 lindo.
- [ ] La más barata coincide con el mínimo de la tabla.
- [ ] El chart cambia de rango y tiene tooltip; con reduced-motion no anima.
- [ ] En mobile la tabla es lista de cards, sin scroll horizontal.
- [ ] Badges con ícono + texto + tooltip.
- [ ] Lighthouse mobile: Performance ≥ 90, Accesibilidad ≥ 95.
