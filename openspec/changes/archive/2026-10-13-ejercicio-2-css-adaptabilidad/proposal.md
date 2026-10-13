# Proposal — Ejercicio 2: CSS y adaptabilidad

## Why

La Etapa 1 dejó un `index.html` con estructura semántica y un vocabulario de clases reutilizables, pero **sin ninguna hoja de estilos**: todas las vistas se renderizan con los estilos por defecto del navegador. Esto impide cumplir el Ejercicio 2 de la consigna (20 pts), que exige identidad visual propia, layout con Flexbox o Grid, adaptación a 320 px y 1280 px, foco visible y errores expresados con texto. Sin este change, la entrega no puede puntuar ese ejercicio y la base HTML —aunque correcta— no facilita el uso previsto.

El momento es oportuno: la etapa 1 ya fijó los identificadores, las clases y la estructura de las cinco vistas, de modo que aplicar una hoja de estilos no obliga a reestructurar el documento ni a tocar los puntos de enganche de la Etapa 2.

## What Changes

- **NEW**: archivo `css/estilos.css` como única hoja de estilos externa del proyecto, referenciada desde el `<head>` de `index.html` mediante `<link rel="stylesheet" href="css/estilos.css">`.
- Definición de una **identidad visual coherente** sobre el vocabulario de clases existente (`vista`, `formulario`, `campo`, `campo__control`, `boton`, `boton--principal`, `boton--secundario`, `mensaje`, `mensaje--vacio`, `mensaje--exito`, `mensaje--error`, `tabla`, `tabla-envoltura`, `tarjeta`, `cabecera`, `navegacion`, etc.): paleta de colores, tipografía del sistema, espaciado, tarjetas y formularios.
- **Layout** con Flexbox y Grid para el encabezado, la navegación y la rejilla de formularios/listados (`rejilla-dos-columnas`).
- **Adaptabilidad**: comportamiento sin desplazamiento horizontal de la página entre 320 px y 1280 px; desplazamiento confinado al contenedor `.tabla-envoltura` cuando una tabla lo requiera.
- **Accesibilidad básica**: estados de `:focus-visible`, orden de tabulación natural, contraste y textos de error que no dependan solo del color.
- Ajuste mínimo de `index.html` para asegurar que el vínculo a la hoja de estilos respete las reglas del proyecto (sin CDNs ni dependencias).

## Capabilities

### New Capabilities

- `identidad-visual-y-adaptabilidad`: CSS propio y reutilizable para las cinco vistas existentes; Flexbox/Grid; adaptación a 320 px y 1280 px sin scroll horizontal de página (la tabla se desplaza dentro de su contenedor); foco visible, controles recorribles por teclado y asociación de estados con texto además del color; ausencia de librerías, frameworks, CDNs o build tools.

### Modified Capabilities

Ninguna. Este change no altera los requisitos de `estructura-html-libreria` ni `puntos-de-enganche-libreria`: solo añade la capa de presentación sobre la estructura existente. Los requisitos HTML, accesibles y de enganche se mantienen intactos.

## Impact

- **Nuevo**: `css/estilos.css` y la carpeta `css/`.
- **Modificado**: `index.html`, únicamente en el `<head>` para agregar el `<link>` de la hoja de estilos local. No se alteran identificadores, estructura ni contenido textual.
- **Inalterado**: todos los `id`, `name`, clases base y puntos de enganche definidos en la Etapa 1; ningún archivo de JavaScript ni de datos se agrega en este change.
- **Entrega**: el proyecto sigue abriéndose por doble clic en `index.html` y sin realizar ninguna petición de red; las imágenes, si se incorporaran en etapas posteriores, se alojarán en `assets/img/`.

EOF