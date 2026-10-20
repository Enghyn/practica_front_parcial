# Proposal

## Why

El TPI de la librería (consigna §9, Ejercicio 6) exige cerrar la entrega con persistencia en `localStorage`, verificación registrada y documentación honesta; hoy los datos viven solo en memoria (`js/datos.js` lo dice explícitamente), así que cada recarga pierde altas y ventas, el caso 6 de la §10 no se puede reproducir y el README declara pendientes que ya no lo son.

## What Changes

- **Persistencia en `localStorage`** de `libros`, `clientes` y `ventas`, con escritura en cada mutación relevante (alta de libro, alta de cliente, confirmación de venta) y restauración al abrir la página.
- **Siembra única con clave de versión**: una bandera `storageVersion` en `localStorage` evita que los datos iniciales se dupliquen al reabrir; si la versión guardada difiere de la actual o el contenido está corrupto, se vuelve a sembrar sin romper la aplicación.
- **Módulo de persistencia propio** (`js/persistencia.js`) que se carga **antes** de `js/datos.js`, para que los datos guardados estén restaurados antes de que el catálogo, las altas y el historial se inicialicen.
- **Los datos literales no se persisten**: `editoriales`, `generos` y `autores` quedan fijos en el código, porque no se administran (§6.6) y no cambian; se documenta la decisión.
- **Verificación manual documentada**: se ejecutan en el navegador los 8 casos de la §10 y se registra en el README el **resultado real observado**, completando los casos 1, 6, 7 y 8 que faltaban y revalidando 2–5 con la persistencia activa.
- **Caso 6 reproducible**: el README identifica el nombre exacto de las claves de `localStorage` y la estructura del JSON guardado, con los pasos para alterar únicamente el precio de un libro en el catálogo guardado y comprobar que la venta conserva sus importes históricos.
- **Documentación de cierre**: el README pasa de "persistencia pendiente" a "funciona", completa las secciones obligatorias (quiénes son, ubicación de los datos iniciales, funcionamiento y límites de `localStorage`, procedencia de imágenes, funcionalidades implementadas y pendientes) y `AGENTS.md` §14 deja de listar la persistencia como pendiente.

## Capabilities

### New Capabilities

- `persistencia-local-storage`: conservación de libros, clientes y ventas en `localStorage` con siembra única versionada, restauración al cargar, escritura en cada mutación y caída segura ante datos ausentes o corruptos.
- `documentacion-y-verificacion`: estado real de la entrega y registro de los resultados observados de los 8 casos manuales de la §10, con la identificación de la ubicación y la estructura del catálogo guardado para reproducir la comprobación del precio histórico.

### Modified Capabilities

- `puntos-de-enganche-libreria`: el requisito de honestidad sobre el estado de implementación cambia porque la persistencia deja de estar pendiente en los textos visibles del documento (aviso de estado, `<noscript>` y pie de página).

## Impact

- **Código**: `js/persistencia.js` (nuevo, se carga primero en `index.html`), `js/datos.js` (siembra/restauración y escritura tras cada alta), `js/altas.js` y `js/ventas.js` (persistir al confirmar), `index.html` (orden de los scripts y textos de estado).
- **Documentación**: `README.md` (estado real, secciones obligatorias, casos manuales 1–8, estructura del catálogo guardado) y `AGENTS.md` §14 (estado del repositorio).
- **Sin dependencias nuevas**: HTML, CSS y JavaScript nativos; sin librerías, CDNs, `package.json`, `node_modules`, build tools, backend ni `fetch`.
- **Sin tests automatizados**: la verificación es por casos manuales ejecutados en el navegador; no se agrega ningún runner al proyecto.
