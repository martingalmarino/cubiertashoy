# Prompt 04d — Últimos detalles visuales (corto)

> Después de esto, seguí con 06. No toques datos, lógica, rutas ni SEO.

## PROMPT PARA CURSOR

Arreglá solo estos detalles visuales, en orden:

1. **Chip de medida en /medida ocupa todo el ancho.** El contenedor padre es flex-col/grid y lo estira. Envolvelo o usá `self-start inline-flex w-fit h-7 px-3 rounded-full bg-asfalto-950 text-white font-mono text-xs font-semibold items-center`.
2. **Gráfico de historial con eje Y desde 0** (línea plana arriba, 70% del área vacía). En Recharts `<YAxis domain={[(min)=>Math.floor(min*0.92/1000)*1000, (max)=>Math.ceil(max*1.05/1000)*1000]} tickCount={4} />` y `tickFormatter` → `$ 90 k`. El área (`<Area>`) con `baseValue="dataMin"` para que el degradé no arranque en 0. Alto del gráfico `h-64 md:h-72`.
3. **Botón "Ver precios" lavado** (parece deshabilitado aunque es el CTA principal): estado normal `bg-accion-600 text-white shadow-sm hover:bg-accion-700`; deshabilitado solo cuando falta un valor, `bg-accion-600/50 cursor-not-allowed`. En el buscador del header, mismo criterio.
4. **Espacios grandes**: hero → "Medidas populares" tiene ~90 px vacíos extra; dejá `pb-12 md:pb-16` en el hero y `py-10 md:py-14` en secciones. En /medida, quitá los `<hr>`/bordes entre secciones o dejá uno solo con `my-10`.
5. **Secciones sin datos todavía** ("Autos que usan esta medida" vacía; "Medidas parecidas" con 1 chip): **ocultá la sección si no hay datos** (`if (!autos.length) return null`; parecidas solo si hay ≥2). Nada de texto de "todavía no tenemos".
6. **Tabla**: columna "Tarjeta" en `text-tinta-500` está bien, pero alineá a la derecha encabezados de Efectivo/Tarjeta igual que los valores (`text-right`), y fila del más barato con `bg-ahorro-50/40` además del borde verde.
7. **Termómetro del resumen**: marcador hoy casi invisible pegado a la izquierda; `size-3.5 rounded-full bg-ahorro-600 ring-2 ring-white shadow`, barra `h-2`, y tramo coloreado `bg-gradient-to-r from-ahorro-600/40 to-oferta-600/30`.

**Sobre los círculos oscuros flotantes a la derecha**: no aparecen en visitas anónimas (verificado, el único `fixed` es el header y la barra CTA mobile). Es el **Vercel Toolbar** que Vercel muestra cuando estás logueado. No es un bug del sitio. Si molesta: Vercel → Project → Settings → General → *Vercel Toolbar* → desactivar para Production (o ocultarlo con ⌘. / ctrl.).

### Checklist
- [ ] Chip de medida del ancho de su texto.
- [ ] Gráfico con eje Y ajustado, línea con variación visible.
- [ ] CTA del buscador azul pleno cuando está habilitado.
- [ ] Secciones vacías ocultas; sin huecos > 64 px entre secciones.
- [ ] Capturas `despues-04d` de home y `/medida/165-70-r13` a 1440 y 390 (scrolleando antes).
