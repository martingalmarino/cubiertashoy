# Prompt 15 — Mini buscador del header (comportamiento útil)

> Pegalo entero en Cursor (modo Agent).

---

## PROMPT PARA CURSOR

El buscador compacto del header (`MedidaSearch variant="compact"` en `Header.tsx`) hoy parece muerto: muestra placeholders `175 / 65 R 14` y el botón “Ver precios” no hace nada si no elegiste los 3 campos. Arreglá el comportamiento.

### Comportamiento esperado
1. **Desktop (`md+`)**: visible en el header en **todas** las páginas con datos de medidas, no solo cuando hay `#hero` scrolleado. Si no existe `#hero`, mostralo siempre (`showCompact = true`). Si hay hero, mantené el IntersectionObserver actual.
2. **Mobile**: sigue oculto (el menú ya cubre nav; el buscador grande está en el hero/home).
3. **Cascada** igual que el hero: Ancho → Perfil → Rodado.
4. **Al completar el rodado**: navegar automáticamente a `/medida/{slug}` (mismo `router.push` que el submit). El botón “Ver precios” sigue funcionando como respaldo.
5. **Preselección**: si la ruta es `/medida/[slug]`, inicializá ancho/perfil/rodado con esa medida. Si el usuario cambia y completa otra, navegar a la nueva.
6. **Botón deshabilitado**: si faltan campos, `aria-disabled` + `title` claro (“Elegí ancho, perfil y rodado”). Opcional: al clickear deshabilitado, un `text-xs text-tinta-500` debajo o toast corto — no un no-op silencioso.
7. Placeholders: dejá ejemplos, pero visualmente distintos del valor elegido (opacidad / color), para que no parezcan ya seleccionados.

### No tocar
Scrapers, seed de medidas, SEO, menú mobile (05d).

### Cierre
`npm run build` + lint OK. Capturas desktop: home scrolleada, `/medidas` (siempre visible), `/medida/175-65-r14` con valores precargados, y cambio a otra medida. Lista de archivos tocados.
