# Tasks

## 1. Borrado de CSS, JavaScript y datos de ejemplo

- [x] 1.1 Eliminar el archivo `js/filtro-catalogo.js` y la carpeta `js/` completa, y verificar que `js/` ya no existe en el proyecto
- [x] 1.2 Eliminar el archivo `css/estilos.css` y la carpeta `css/` completa, y verificar que `css/` ya no existe en el proyecto
- [x] 1.3 Quitar del `index.html` el `<link rel="stylesheet" href="css/estilos.css">` y el `<script src="js/filtro-catalogo.js" defer></script>` del `<head>`, y verificar que no queda ninguna etiqueta `<link>` ni `<script>` en el documento
- [x] 1.4 Eliminar del `index.html` los 6 `<li>` de libros del contenedor `#lista-catalogo` y toda la lista de ejemplo del catálogo, dejando `#lista-catalogo` como `<ul>` vacío, y verificar que el catálogo no muestra ningún libro
- [x] 1.5 Vaciar el `<tbody>` de `#tabla-libros` (6 filas de ejemplo) conservando `<caption>` y `<thead>`, y verificar que la tabla muestra solo los encabezados
- [x] 1.6 Vaciar el `<tbody>` de `#tabla-clientes` (3 filas de ejemplo) conservando `<caption>` y `<thead>`, y verificar que la tabla muestra solo los encabezados
- [x] 1.7 Vaciar el `<tbody>` y el `<tfoot>` de `#tabla-renglones` (2 renglones de ejemplo y el total de ejemplo) conservando `<thead>`, y verificar que la tabla de renglones no muestra filas ni total
- [x] 1.8 Vaciar el `<tbody>` de `#tabla-ventas` (2 ventas de ejemplo, incluidos sus botones "Ver detalle") conservando `<caption>` y `<thead>`, y verificar que el historial no muestra ventas
- [x] 1.9 Vaciar el `<tbody>` y el `<tfoot>` de la tabla dentro de `#detalle-venta`, y vaciar el texto del `<summary>` de ejemplo para que quede como marcador del detalle, y verificar que el bloque de detalle no muestra renglones
- [x] 1.10 Eliminar de `#libro-editorial` las 2 `<option>` de ejemplo y dejar solo la opción placeholder con `value=""`; eliminar de `#libro-genero` las opciones "Terror" y "Ciencia ficción" y dejar solo `Sin clasificar` con `value=""`; eliminar de `#libro-autores` las 3 `<option>` de ejemplo conservando el `multiple` y el `size="4"`; eliminar de `#venta-cliente` y `#venta-libro` todas sus `<option>` de ejemplo y dejar solo el placeholder con `value=""`; y verificar que ningún selector contiene nombres de libros, editoriales, géneros, autores o clientes

## 2. Limpieza de los marcadores de pendiente

- [x] 2.1 Quitar la clase `pendiente` de los botones de alta de libro, de alta de cliente, de agregar renglón y de confirmar venta, y verificar con búsqueda de texto que no queda la cadena `pendiente` como clase en el documento
- [x] 2.2 Eliminar todos los `<span class="etiqueta etiqueta--pendiente">etapa 2</span>` de los botones y de las descripciones de las vistas, y verificar que no queda ningún `<span>` con esas clases
- [x] 2.3 Eliminar los modificadores de vista `vista--catalogo`, `vista--libros`, `vista--clientes`, `vista--ventas` e `vista--historial`, y verificar que cada `<section>` conserva su clase base `vista` y su `id`
- [x] 2.4 Reescribir el párrafo de aviso posterior al `<header>` para que en texto plano indique que las cinco vistas están construidas pero que **ninguna operación funciona todavía** (altas, venta, historial) y que **el filtro por título del catálogo aún no está implementado**, y verificar leyendo el documento que el aviso no afirma ninguna funcionalidad

## 3. Esqueleto del documento y navegación

- [x] 3.1 Verificar que `index.html` arranca con `<!DOCTYPE html>` y que el `<html>` declara `lang="es"`, y que el `<head>` tiene `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">` y un `<title>` descriptivo; corregir lo que falte y verificarlo en el archivo
- [x] 3.2 Mantener el enlace de salto al contenido como primer elemento del `<body>`, apuntando a `#catalogo`, y verificar que el `id` `catalogo` existe
- [x] 3.3 Mantener el `<header>` con el `<h1>` del título de la librería y el `<nav aria-label="…">` con sus cinco enlaces; verificar que los `href` son `#catalogo`, `#libros`, `#clientes`, `#ventas` e `#historial` y que cada destino existe
- [x] 3.4 Verificar que cada una de las cinco `<section>` tiene su `id` (`catalogo`, `libros`, `clientes`, `ventas`, `historial`), su `<h2>` con `id` (`titulo-catalogo`, `titulo-libros`, `titulo-clientes`, `titulo-ventas`, `titulo-historial`) y su `aria-labelledby` apuntando a ese `<h2>`

## 4. Catálogo

- [x] 4.1 Verificar que `#formulario-busqueda` tiene `novalidate`, el campo `input` con `id="busqueda-titulo"` y `name="busqueda"`, su `<label for="busqueda-titulo">`, y los botones `type="submit"` con texto "Buscar por título" (`#boton-buscar`) y `type="reset"` con texto "Limpiar búsqueda" (`#boton-limpiar-busqueda`); agregar los `id` que falten
- [x] 4.2 Verificar que existen `#mensaje-catalogo-vacio` (lista vacía) y `#mensaje-sin-resultados` (búsqueda sin resultados) como dos elementos distintos, ambos **visibles** (sin `hidden`) y con texto que explique el estado, ya que en esta etapa no hay libros
- [x] 4.3 Verificar que `#lista-catalogo` es un `<ul>` vacío y colocar encima un comentario `<!-- ENGANCHE ETAPA 2: aquí se renderizan los libros desde el array local; cada libro muestra título, ISBN, editorial, género, autores y precio, o el literal "Sin clasificar" si no tiene género -->`

## 5. Vista de Libros

- [x] 5.1 Verificar que `#formulario-alta-libro` tiene `novalidate` y un `<h3>` de título, y que sus seis campos tienen `id`, `name` y `<label for>`: `libro-titulo`/`titulo`, `libro-isbn`/`isbn`, `libro-precio`/`precio` (con `type="number"`, `min="0"`, `step="0.01"`), `libro-editorial`/`editorial`, `libro-genero`/`genero` y `libro-autores`/`autores` (con `multiple` y `size="4"`); corregir lo que falte
- [x] 5.2 Verificar que el botón de envío es `type="submit"` con el texto "Agregar libro" y tiene el `id` `boton-agregar-libro`
- [x] 5.3 Verificar que existen `#mensaje-exito-libro` y `#mensaje-error-libro` como dos contenedores distintos con texto legible que explica el estado, y que ninguno de los dos depende solo del color
- [x] 5.4 Verificar que `#tabla-libros` tiene `<caption>`, `<thead>` con seis `<th scope="col">` (Título, ISBN, Editorial, Género, Autores, Precio) y un `<tbody id="cuerpo-libros">` vacío, con un comentario de enganche, y que `#mensaje-libros-vacio` está presente y visible
- [x] 5.5 Agregar `id="tabla-libros"` a la tabla y `id="cuerpo-libros"` a su `<tbody>`, y verificar que ambos ids no están repetidos en el documento

## 6. Vista de Clientes

- [x] 6.1 Verificar que `#formulario-alta-cliente` tiene `novalidate` y que sus dos campos tienen `id`, `name` y `<label for>`: `cliente-nombre`/`nombre` y `cliente-email`/`email` (con `type="email"`); corregir lo que falte
- [x] 6.2 Verificar que el botón de envío es `type="submit"` con el texto "Agregar cliente" y tiene el `id` `boton-agregar-cliente`
- [x] 6.3 Verificar que existen `#mensaje-exito-cliente` y `#mensaje-error-cliente` como dos contenedores distintos con texto legible, y que `#mensaje-clientes-vacio` está presente y visible
- [x] 6.4 Verificar que `#tabla-clientes` tiene `<caption>`, `<thead>` con dos `<th scope="col">` (Nombre completo, Correo electrónico) y un `<tbody id="cuerpo-clientes">` vacío con comentario de enganche; **eliminar la columna "Fecha de alta"** del `<thead>` si sigue presente

## 7. Vista de Ventas

- [x] 7.1 Verificar que `#formulario-venta` tiene `novalidate` y que sus tres campos tienen `id`, `name` y `<label for>`: `venta-cliente`/`cliente`, `venta-libro`/`libro` y `venta-cantidad`/`cantidad` (con `type="number"`, `min="1"`, `step="1"`); corregir lo que falte
- [x] 7.2 Verificar que los botones tienen los ids `boton-agregar-renglon` (`type="button"`, texto "Agregar renglón") y `boton-confirmar-venta` (`type="button"`, texto "Confirmar venta"), con texto descriptivo de la acción
- [x] 7.3 Verificar que `#tabla-renglones` tiene `<caption>`, `<thead>` con cuatro `<th scope="col">` (Libro, Cantidad, Precio unitario, Subtotal), un `<tbody id="cuerpo-renglones">` vacío con comentario de enganche y un `<tfoot>` con una única fila cuyo `<th scope="row" colspan="3">` dice "Total de la venta" y un `<td id="total-venta">`
- [x] 7.4 Verificar que existen `#mensaje-exito-venta`, `#mensaje-error-venta` y `#mensaje-renglones-vacio` (agregar este último si falta), los tres con texto legible, y que el de venta rechazada menciona las causas de rechazo (sin cliente, sin renglones, cantidades inválidas)

## 8. Vista de Historial

- [x] 8.1 Verificar que `#tabla-ventas` tiene `<caption>`, `<thead>` con cinco `<th scope="col">` (Identificador, Fecha, Cliente, Total, Detalle) y un `<tbody id="cuerpo-ventas">` vacío con comentario de enganche; eliminar la columna "Detalle" del `<thead>` si el change decide que el botón de detalle lo agrega la Etapa 2
      → **Decisión:** la columna "Detalle" **se conserva**. El spec `estructura-html-libreria` la exige textualmente ("columnas Identificador, Fecha, Cliente, Total y Detalle") y, según la consigna del change, el spec manda sobre el HTML previo.
- [x] 8.2 Verificar que `#mensaje-historial-vacio` está presente y visible con texto legible
- [x] 8.3 Verificar que `#detalle-venta` es un `<details>` con `<summary id="detalle-venta-resumen">` de texto genérico ("Detalle de la venta seleccionada"), que dentro tiene `#tabla-detalle-venta` con `<thead>` de cuatro columnas, `<tbody id="cuerpo-detalle-venta">` vacío y un `<tfoot>` con `<td id="detalle-venta-total">`, y quitarle el atributo `open`
- [x] 8.4 Agregar `id="tabla-detalle-venta"`, `id="cuerpo-detalle-venta"`, `id="detalle-venta-resumen"` y `id="detalle-venta-total"` si faltan, y verificar que no están repetidos

## 9. Señalización del alcance

- [x] 9.1 Agregar un `<noscript>` visible al inicio de `<main>` que explique en texto que las cinco vistas están construidas pero que los listados y formularios se completan en la etapa 2
- [x] 9.2 Verificar que cada punto de enganche carries un comentario `<!-- ENGANCHE ETAPA 2: … -->` en español y breve: `#lista-catalogo`, cada `<tbody>` (cinco), cada grupo de contenedores de mensaje y cada `<select>` sin opciones
- [x] 9.3 Revisar el `<footer>` para que describa la etapa 1 sin afirmar que hay datos de ejemplo, CSS ni JavaScript

## 10. Verificación estática

- [x] 10.1 Buscar `http://` y `https://` en **todos** los archivos del proyecto (`index.html`, `README.md`, `AGENTS.md`, `docs/`) y verificar que no hay ninguna coincidencia fuera de la referencia documental al PDF
- [x] 10.2 Buscar `<link`, `<script`, `estilos.css` y `filtro-catalogo.js` en `index.html` y verificar que no hay ninguna coincidencia, y que `css/` y `js/` no existen
- [x] 10.3 Extraer todos los atributos `for` de los `<label>` y todos los `id` del documento, y verificar que **cada `for` apunta a un `id` existente** y que **no hay `id` repetidos**
- [x] 10.4 Verificar que cada una de las cinco tablas tiene `<thead>` con `<th scope="col">` para cada columna y que los `<tbody>` están vacíos
- [x] 10.5 Verificar que existen los once contenedores de mensaje esperados: `mensaje-catalogo-vacio`, `mensaje-sin-resultados`, `mensaje-libros-vacio`, `mensaje-exito-libro`, `mensaje-error-libro`, `mensaje-clientes-vacio`, `mensaje-exito-cliente`, `mensaje-error-cliente`, `mensaje-renglones-vacio`, `mensaje-exito-venta`, `mensaje-error-venta`, `mensaje-historial-vacio`, y que cada uno contiene texto no vacío
- [x] 10.6 Verificar que no queda en `index.html` ningún dato de ejemplo (títulos de libros, ISBN de ejemplo, nombres de editoriales, géneros, autores, clientes ni fechas de venta)
- [ ] 10.7 Abrir `index.html` con doble clic y recorrer las cinco vistas: verificar que se navega por anclas, que **ningún formulario recarga la página**, que no hay errores en la consola y que la pestaña Network del navegador no registra ninguna petición
      → **NO EJECUTADA.** Requiere abrir un navegador, que no está disponible en esta sesión. Queda pendiente de verificación manual.
      > Nota: el enunciado de esta tarea pide comprobar que *ningún formulario recarga la página*, algo que en esta etapa **no puede cumplirse**: los formularios no tienen `preventDefault` porque no hay JavaScript. El comportamiento real (recarga nativa del navegador al enviar) está declarado en el `README.md` §4 y debe tenerse en cuenta al planificar la Etapa 2.

## 11. Documentación de la etapa

- [x] 11.1 Reemplazar `README.md` por una versión corta de etapa 1 que declare: cómo abrir `index.html` con doble clic, que el proyecto contiene **solo** `index.html` (sin `css/` ni `js/`), qué incluye la entrega, y una lista explícita de lo que **todavía no funciona** (altas, venta, historial y filtro por título) remitiendo a la etapa 2
- [x] 11.2 En el `README.md` corto, identificar expresamente qué pantallas son **maquetas/estructura** y qué interacciones **ya funcionan** (ninguna), según `AGENTS.md` §9.2.9 y §9.3
- [x] 11.3 Verificar que el `README.md` no menciona `css/estilos.css`, `js/filtro-catalogo.js`, datos de ejemplo ni los 8 casos manuales ejecutados, y que sí indica dónde están los datos iniciales (que en esta etapa no hay, porque los carga la etapa 2)