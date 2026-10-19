## Why

La verificación del Ejercicio 4 confirmó que las altas de libros y clientes funcionan con validaciones completas, y el Ejercicio 3 (datos locales, catálogo y filtro) también está operativo. Sin embargo, el `index.html` y el `README.md` conservan textos de la "Etapa 1" que afirman en falso que "ninguna operación funciona todavía", que "no hay estilos ni JavaScript" y que "en la etapa 2 se informará el motivo exacto de cada error". Eso contradice el estado real y viola el principio de honestidad de verificación de `AGENTS.md` §9.2 y §9.3 ("no se indica una prueba como aprobada sin ejecutarla" / registrar el comportamiento real).

## What Changes

- `index.html` — solo textos visibles, sin tocar estructura, `id`, clases ni enganches:
  - bloque `#aviso-etapa`: reemplazar el texto falso de Etapa 1 por el estado real (Ej 3 y 4 operativos; Ej 5 y 6 pendientes);
  - bloque `<noscript>`: mismo criterio, conservando la intención de avisar a quien navega sin JavaScript que los listados y operaciones requieren JS;
  - descripciones de las vistas Libros yClientes: eliminar "Estructura preparada; el alta todavía no funciona" y reflejar que el alta funciona con validaciones y listado en vivo;
  - textos por defecto de `#mensaje-error-libro` y `#mensaje-error-cliente`: quitar la promesa "En la etapa 2 se informará el motivo exacto de cada error";
  - `meta description` y texto del `<footer>`: eliminar "sin estilos ni comportamientos" / "sin estilos, sin JavaScript y sin datos" y declarar el estado real.
- `README.md` — unificar todo el documento al estado real (las secciones §3, §4, §5, §6 y §7 se contradecen entre sí hoy), incluyendo la estructura del proyecto con `css/` y `js/`, y registrar los resultados ejecutados de los casos manuales 2 y 3 de la §10 (ISBN duplicado rechazado / ISBN nuevo aceptado; email inválido rechazado / email existente en mayúsculas rechazado / email nuevo aceptado), con honestidad de verificación.
- Delta specs en `puntos-de-enganche-libreria`: los requisitos "Honestidad sobre lo que todavía no funciona" y "Señalización en comentarios y noscript" quedan contradichos por los nuevos textos y se actualizan.
- **Fuera de alcance (explícito):** implementación del Ejercicio 5 (ventas e historial) y del Ejercicio 6 (persistencia `localStorage`); refactor de `js/altas.js` o `js/catalogo.js` (verificados y completos); cambios de estructura HTML, `id`, clases o enganches; actualización de `AGENTS.md` §14 (deriva preexistente de documentación canónica).

## Capabilities

### New Capabilities

_(ninguna)_

### Modified Capabilities

- `puntos-de-enganche-libreria`: los requisitos "Honestidad sobre lo que todavía no funciona" (el documento ya no puede afirmar que ninguna operación funciona) y "Señalización en comentarios y noscript" (el aviso sin JavaScript debe reflejar el estado real en lugar de prometer que los listados se completan en la etapa 2) cambian de requerimiento para acomodar los textos honestos del estado actual.

## Impact

- Archivos de aplicación modificados: `index.html` (solo contenido textual de 6 puntos), `README.md` (unificación + registros de casos manuales 2 y 3).
- Archivos NO modificados: `js/datos.js`, `js/catalogo.js`, `js/altas.js`, `css/estilos.css`, `AGENTS.md`.
- Sin cambios de comportamiento: el JavaScript existente sigue reemplazando los mensajes de error con `textContent`; los textos estáticos nuevos solo deben dejar de desinformar antes de que el JS los reemplace.
- Specs afectados (deltas): `openspec/specs/puntos-de-enganche-libreria` (2 requisitos modificados). Deriva preexistente fuera de alcance: "Documento sin estilos, sin scripts y sin datos embebidos" (puntos-de-enganche) y "Entrega sin carpetas de estilo ni script" (estructura-html) ya estaban contradichas por la implementación de los Ej 3 y 4 en cambios anteriores; se deja para un cambio de sincronización de specs aparte.
