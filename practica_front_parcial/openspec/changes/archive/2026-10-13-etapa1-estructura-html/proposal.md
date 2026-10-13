# Proposal — Etapa 1 reducida a estructura HTML

## Why

El avance anterior (`etapa1-maquetacion-libreria`) entregó una maqueta completa con CSS y con el filtro por título funcionando, pero el usuario decidió **reducir la Etapa 1 a la sola estructura HTML**: separar el trabajo en "estructura" y "comportamiento/presentación" para poder avanzar primero sobre una base semántica sólida, sin arrastrar estilos y scripts que después habrá que revisar y volver a validar.

Hoy el repositorio contiene `css/estilos.css`, `js/filtro-catalogo.js` y ~11 KB de datos de ejemplo escritos a mano en el HTML, más un `README.md` que describe un alcance que ya no aplica. Este change **retira todo eso** y deja un `index.html` que contiene **solo estructura semántica y el contrato de enganche** que la Etapa 2 va a completar con datos locales, sin tener que rediseñar ninguna vista.

El resultado debe seguir cumpliendo el Ejercicio 1 de la consigna (§4 de `AGENTS.md`): las 5 vistas, navegación clara, HTML semántico, `label` asociado a cada campo, botones con texto descriptivo, tablas con `<thead>` y contenedores de mensaje para lista vacía, búsqueda sin resultados y operaciones correctas o rechazadas.

## What Changes

- **BREAKING**: se reescribe `index.html` y pasa a contener **únicamente estructura HTML**. Se elimina toda referencia a CSS (`<link rel="stylesheet">`) y a JavaScript (`<script src>`).
- **BREAKING**: se elimina el archivo `css/estilos.css` completo, junto con la carpeta `css/`.
- **BREAKING**: se elimina el archivo `js/filtro-catalogo.js` completo, junto con la carpeta `js/`. El **filtro por título deja de ser una interacción funcional** en esta etapa.
- **BREAKING**: se eliminan **todos los datos de ejemplo estáticos** del HTML: los 6 libros del catálogo y de la tabla de libros, las 2 editoriales, los 2 géneros, los 3 autores, los 3 clientes, las 2 ventas de ejemplo del historial y sus renglones, y todas las filas de ejemplo de las tablas. Todos los `<tbody>` quedan vacíos.
- Se eliminan los marcadores visuales de pendiente que dependían del CSS: la clase `pendiente` en los botones y el `<span class="etiqueta etiqueta--pendiente">etapa 2</span>`.
- Se conservan y se **normalizan los `id`** de secciones, formularios, campos, botones, tablas, `<tbody>` y contenedores de mensaje, de modo que la Etapa 2 pueda engancharse sin ambigüedad.
- Se cambian los `name` de los campos de formulario para que calquen la entidad (`titulo`, `isbn`, `precio`, `editorial`, `genero`, `autores`, `nombre`, `email`, `cliente`, `libro`, `cantidad`, `busqueda`).
- Se dejan los `<select>` de editorial, género, autores, cliente y libro **vacíos de opciones de ejemplo**, con una única opción placeholder; **excepción**: el selector de género conserva la opción `Sin clasificar` con `value=""`, porque representa la ausencia de género y no es un dato de ejemplo.
- Se agregan **comentarios HTML** en cada punto de enganche y un bloque `<noscript>` que explican que los listados se completan en la etapa 2, reemplazando la señalización visual que aportaba el CSS.
- Se **regenera `README.md`** con un alcance mínimo y honesto: qué es estructura, qué está vacío, qué no funciona todavía, y que no hay estilos ni scripts.
- El `<nav>` **se mantiene como un único `index.html` con anclas** a las cinco vistas; no se divide en varias páginas.

### Fuera de alcance (se abordan en changes de etapa 2)

- Modelo de datos en arrays/objetos con identificadores estables y siembra mínima (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes).
- Renderizado del catálogo y de los listados desde JavaScript (todo dato de usuario insertado con `textContent`, nunca con `innerHTML`).
- Filtro por título del catálogo como interacción funcional (`trim`, mayúsculas/minúsculas, subcadena, búsqueda vacía, mensaje sin resultados).
- Altas de libros y de clientes con sus validaciones (ISBN no duplicado normalizado sin espacios ni guiones, precio numérico > 0, selectores generados desde los datos, email con formato válido y único con `trim` + `toLowerCase`), y los errores mostrados junto al campo.
- Venta simulada: renglones, rechazo de libros repetidos, cambios de cantidad, eliminación de renglones, `subtotal = cantidad × precio`, `total = Σ subtotales`, importes con dos decimales.
- Confirmación de venta e **historial inmutable** con el precio unitario copiado al renglón en el momento de la confirmación (§8.4).
- Persistencia con `localStorage` y bandera `storageVersion` para sembrar una sola vez.
- CSS en archivos externos, identidad visual, Flexbox/Grid, foco visible, pruebas a 320 px y 1280 px, desplazamiento propio de tablas.
- README final con los 8 casos manuales ejecutados y registrados (§10) y la explicación de `localStorage`.

## Capabilities

### New Capabilities

- `estructura-html-libreria`: el documento `index.html` como entrada única y autónoma, semántico (`<header>`/`<nav>`/`<main>`/`<section>`), con las cinco vistas (Catálogo, Libros, Clientes, Ventas, Historial) navegables por anclas, cada campo de formulario con `<label for>` asociado, cada botón con texto que describa su acción, cada tabla de datos con `<caption>` y `<thead>` con `<th>`, y los contenedores de mensaje de lista vacía, de búsqueda sin resultados y de operación correcta o rechazada expresados con texto.
- `puntos-de-enganche-libreria`: el contrato que la Etapa 2 aplica sin reestructurar el documento: `id` estables y únicos para secciones, formularios, campos, botones, tablas, `<tbody>` y contenedores de mensaje; `name` de campo que calcan la entidad; listados y `<tbody>` vacíos como destino de render; `<select>` sin opciones de ejemplo salvo el placeholder (y la opción permanente `Sin clasificar` en género); comentarios HTML y `<noscript>` señalando los puntos de enganche; y ausencia total de CSS, JavaScript y datos embebidos en el documento.

### Modified Capabilities

Ninguna. El proyecto todavía no tiene specs sincronizadas (`openspec list --specs` no devuelve ninguna), así que no hay capacidades existentes que modificar.

> **Nota sobre el change anterior.** `etapa1-maquetacion-libreria` declara cuatro capacidades (`estructura-y-navegacion`, `maqueta-datos-ejemplo`, `identidad-visual-y-adaptabilidad`, `filtro-catalogo-por-titulo`) que este change **reemplaza por completo**. Ese change **no debe archivarse**, porque archivar sincronizaría sus delta specs a `openspec/specs/` con un alcance que el usuario descartó. Ver "Impact".

## Impact

- **Reescrito**: `index.html` (22,7 KB → HTML solo estructura, con datos, CSS y JS eliminados).
- **Eliminado**: `css/estilos.css` y la carpeta `css/`; `js/filtro-catalogo.js` y la carpeta `js/`.
- **Eliminado del HTML**: ~11 KB de datos de ejemplo estáticos y los marcadores `.pendiente` / `.etiqueta--pendiente`.
- **Regenerado**: `README.md` (11,7 KB → versión corta de etapa 1).
- **Se conserva**: `AGENTS.md`, `docs/Repaso Primer Parcial.pdf`, `openspec/config.yaml`.
- **No se agrega**: `package.json`, `node_modules/`, bundlers, librerías de JS o CSS, CDNs, `<script src="https://…">`, `<link href="https://…">`, backend ni llamadas `fetch`. El proyecto sigue abriéndose con doble clic en `index.html` y **no realiza ninguna petición de red**.
- **Note**: las carpetas `css/` y `js/` que la consigna (§3) exige en la entrega final se recrearán en los changes de etapa 2; en esta etapa el proyecto se entrega sin ellas.
- **Efecto sobre la evaluación**: la entrega de esta etapa **no puntúa** en el Ejercicio 2 (CSS y adaptabilidad) ni en el filtro del Ejercicio 3, porque esa funcionalidad pasa a la etapa 2. Se conserva intacta la preparación del Ejercicio 1 y la base semántica de los ejercicios 3 a 6.
- **Change previo**: se recomienda **descartar `etapa1-maquetacion-libreria`** (eliminar su carpeta en `openspec/changes/`, sin archivar) una vez este change esté implementado y validado, para que no queden dos alcances contradictorios registrados.