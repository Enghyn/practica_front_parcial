## Context

El proyecto ya tiene implementados y verificados el Ejercicio 3 (datos locales en `js/datos.js`, catálogo renderizado y filtro por título en `js/catalogo.js`) y el Ejercicio 4 (altas de libros y clientes con validaciones en `js/altas.js`). El HTML, el CSS y los IDs de enganche están estables y NO se tocan en este change. Lo que queda desalineado es puramente textual: `index.html` (6 puntos de texto) y `README.md` siguen describiendo el estado de la Etapa 1. Ver `proposal.md` - Why para la motivación.

## Goals / Non-Goals

**Goals:**
- Que todo texto visible del `index.html` (aviso de estado, `noscript`, descripciones de vistas, mensajes de error por defecto, `meta description` y footer) describa con exactitud el estado real.
- Que el `README.md` sea un único relato coherente del estado real, con los casos manuales 2 y 3 ejecutados y registrados.
- Actualizar mediante delta los dos requisitos de `puntos-de-enganche-libreria` que los nuevos textos contradicen.

**Non-Goals:**
- Implementar Ejercicio 5 (ventas/historial) o Ejercicio 6 (persistencia).
- Modificar `js/*.js`, `css/estilos.css`, la estructura HTML, los `id`, las clases o los comentarios `ENGANCHE ETAPA 2`.
- Sincronizar la deriva preexistente de specs ("Documento sin estilos, sin scripts y sin datos embebidos" en `puntos-de-enganche-libreria` y "Entrega sin carpetas de estilo ni script" en `estructura-html-libreria`), contradicha por la implementación de los Ej 3 y 4 en cambios anteriores; queda para un cambio de sincronización aparte.
- Actualizar `AGENTS.md` §14 (documentación canónica de la consigna).

## Decisions

1. **Conservar la clase `aviso-maqueta` y el `id="aviso-etapa"` pese al nuevo contenido.** El CSS ya estiliza esa clase y el change no altera enganches. Alternativa considerada: renombrar la clase a `aviso-estado`; descartada porque excede el alcance de "solo textos" y podría romper la estilización existente sin aportar valor evaluativo.
2. **El `<noscript>` conserva su intención original** (avisar a quien navega sin JS) pero cambia el mensaje: en lugar de prometer que los listados se completan en la etapa 2, explica que los listados y operaciones requieren JavaScript y qué vistas son pendientes. Esto mantiene el requisito de accesibilidad sin desinformar.
3. **Los textos por defecto de `#mensaje-error-libro` y `#mensaje-error-cliente` se reescriben como fallback honesto**, no como promesa: el JS ya reemplaza el contenido con `textContent` antes de mostrar el mensaje; el texto estático solo debe sonar correcto si se llegara a ver sin el motivo específico (p. ej. error inesperado). Se elimina toda mención a "etapa 2".
4. **Los casos manuales 2 y 3 se ejecutan de verdad antes de registrarse.** Honesty of verification (AGENTS.md §9.3): se abren `index.html` en el navegador, se realizan las altas descritas y se anota el comportamiento OBSERVADO en el README. Si algo difiere de lo esperado, se registra lo observado y se marca como pendiente/bug, nunca se firma un resultado no ejecutado.
5. **Delta specs con MODIFIED, manteniendo los nombres de requisito** ("Honestidad sobre lo que todavía no funciona" y "Señalización en comentarios y noscript de los puntos de enganche"). Se conservan los nombres para que el merge en `openspec/specs/` reemplace los bloques completos sin necesitar además una operación RENAMED. El requisito de comentarios `ENGANCHE` no cambia (siguen siendo necesarios para el Ej 5 y 6 pendientes); solo se ajusta la cláusula del `noscript`.

## Risks / Trade-offs

- [Los textos nuevos quedan obsoletos en cuanto se implemente el Ej 5/6] → Es aceptable y esperado: el mismo criterio de honestidad obligará a actualizarlos en ese change; el aviso está diseñado para ser editado.
- [Registrar casos manuales sin ejecutarlos] → Mitigación: la tarea de implementation incluye los pasos exactos de reproducción y exige anotar el resultado observado; si el navegador no está disponible, se registra "no ejecutado" en lugar de "aprobado".
- [Tocar de más el README y romper la coherencia con secciones ya correctas (§4)] → Mitigación: la §4 (tabla de estado) es la fuente de verdad ya verificada; las demás secciones se reescriben para alinearse a ella, no al revés.
