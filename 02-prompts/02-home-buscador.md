# Prompt 02 — Home con buscador por medida (datos de ejemplo)
**Objetivo**: una home premium con el buscador de 3 selects funcionando.

## Pegá esto en Cursor (Agent)
```
Copiá 03-datos/seed-medidas.json a web/data/medidas.json. Generá web/data/ofertas-ejemplo.json con, para cada una de las 10 primeras medidas, 6–10 ofertas de EJEMPLO realistas (tiendas: Norauto, Naldo, Neumaflores, 360 Neumáticos; marcas: Fate, Pirelli, Firestone, Goodyear, Bridgestone, Michelin, Kumho, Firemax, XBRI, Wanli; precios por unidad entre $70.000 y $250.000 según rodado, precio tarjeta 10–15% más alto que efectivo, cuotas 3/6/12, colocación sí/no) y 180 días de historial de mediana/mín/máx con ruido y tendencia leve al alza. Cada registro con "ejemplo": true.
Creá lib/medida.ts: parseMedida("175/65 R14" | "175-65-r14" | "175 65 14") -> {ancho, perfil, rodado, slug, label}; con tests.
Creá lib/data.ts con getMedidas(), getMedida(slug), getOfertas(slug), getHistorial(slug) leyendo los JSON.
Construí la home según el wireframe del design-system: hero con textura, título "El mejor precio de tu cubierta, hoy.", componente MedidaSearch (client) con 3 selects dependientes Ancho / Perfil / Rodado con separadores "/" y "R" estilo flanco, foco automático al siguiente select, botón "Ver precios" que navega a /medida/[slug]. Tab "Por auto" deshabilitado con etiqueta "Pronto". Chips de medidas populares. Grid de cards "Medidas más buscadas" con precio desde y variación semanal. Sección "Cómo funciona" (3 pasos), "Por qué confiar", FAQ con accordion. ExampleDataBanner arriba.
Incluí una ilustración SVG simple propia de un flanco con la medida resaltada ("¿Dónde está tu medida?").
```
## Checklist
- [ ] Elegir 175 → 65 → 14 y apretar "Ver precios" navega a /medida/175-65-r14 (aunque todavía dé 404).
- [ ] Los selects solo ofrecen combinaciones que existen en el seed.
- [ ] A 375px los 3 selects entran en una fila y el botón es full width.
- [ ] Se ve el banner "Datos de ejemplo".
- [ ] Tests de parseMedida pasan.
- [ ] No parece una plantilla genérica (textura, medida como héroe, tipografía mono).
