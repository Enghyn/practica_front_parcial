# Design — Ejercicio 2: CSS y adaptabilidad

## Context

Estado actual del repositorio: `index.html` contiene la estructura semántica completa (Etapa 1), con cinco vistas, identificadores estables, una rejilla `rejilla-dos-columnas`, tablas envueltas en `.tabla-envoltura` y un vocabulario de clases reutilizables. **No existe carpeta `css/`**, ni hoja de estilos vinculada, ni imágenes. La consigna del Ejercicio 2 (ver `AGENTS.md` §5) exige identidad visual propia, Flexbox o Grid, adaptación a 320 px y 1280 px, foco visible y errores expresados con texto; las restricciones de §2 prohíben librerías, frameworks, CDNs, build tools o backend.

Este diseño se apoya en los requisitos de `specs/identidad-visual-y-adaptabilidad/spec.md` y no los repite. La motivación está en `proposal.md`.

## Goals / Non-Goals

**Goals:**
- Introducir una única hoja de estilos local (`css/estilos.css`) vinculada desde `index.html`.
- Establecer una identidad visual coherente sobre las clases ya existentes, sin reescribir el HTML.
- Diseñar la adaptación mínima robusta entre 320 px y 1280 px sin scroll horizontal de la página.
- Garantizar foco visible por teclado y estados comunicados también por texto.
- Dejar la base visual lista para que la Etapa 2 (JavaScript y datos) se enganche sin cambios de estructura.

**Non-Goals:**
- No se agregan imágenes ni tipografías externas en este change (se evalúa su procedencia en etapas posteriores).
- No se implementa el filtro, las altas, la venta ni la persistencia (ejercicios 3 a 6, Etapa 2).
- No se refactoriza el HTML ni se cambian identificadores, nombres de campo ni puntos de enganche.
- No se invierten fondos/stablece un diseño corporativo oscuro: se propone un estilo claro, accesible y sobrio (decisión abierta documentada abajo).

## Decisions

### D1. Un único archivo CSS global
**Elegido:** `css/estilos.css` como hoja única, vinculada en el `<head>` con `<link rel="stylesheet" href="css/estilos.css">`.

**Por qué:** cumple la regla de recursos locales y mantiene la separación estricta HTML/CSS. Un solo archivo evita requests múltiples al abrir con doble clic y facilita la entrega por carpeta.
**Alternativa descartada:** separar por vista (`css/cabecera.css`, `css/formularios.css`). Agrega complejidad de orden de carga sin beneficio para el alcance.

### D2. CSS basado en tokens (custom properties) sobre las clases BEM existentes
**Elegido:** definir variables globales `--color-*`, `--espacio-*`, `--radio-*`, `--sombra-*`, `--tipo-*` en `:root`, y consumirlas desde las clases existentes (`vista`, `formulario`, `campo`, `campo__control`, `boton`, `mensaje`, `tabla`, `tabla-envoltura`, `tarjeta`, etc.).

**Por qué:** las clases ya están en el HTML de la Etapa 1; reutilizarlas como API visual evita tocar la estructura. Los tokens permiten ajustar la identidad en un solo lugar.
**Alternativa descartada:** reescribir el HTML para adaptarlo a nuevas clases. Contradice `puntos-de-enganche-libreria`.

### D3. Mobile-first con breakpoints en 320 / 768 / 1280 px
**Elegido:** base estilos para el ancho mínimo (320 px) y reglas `@media (min-width: ...)` para organizar reflow. El layout de dos columnas depende de un ancho mínimo razonable (se colapsa a una columna por debajo del breakpoint).

**Por qué:** la consigna exige funcionalidad en 320 px; partir del ancho mínimo evita scroll horizontal accidental.
**Alternativa descartada:** desktop-first con `max-width`, que suele generar overflow en anchos estrechos.

### D4. Tablas: envoltura con `overflow-x: auto`
**Elegido:** el contenedor `.tabla-envoltura` aplica `overflow-x: auto`. La tabla interna no fuerza ancho de la página; cuando excede, se desplaza dentro del contenedor.

**Por qué:** es la solución esperada por la consigna (caso manual 8) y mantiene la tabla accesible por teclado.
**Alternativa descartada:** ocultar columnas o reducir texto. Pierde información y dificulta la evaluación.

### D5. Foco visible apoyado en `:focus-visible`
**Elegido:** estilos de `:focus-visible` con outline/ring de alto contraste para elementos interactivos, desactivando outline por defecto en clic de ratón con `:focus:not(:focus-visible)` para no estorbar sin perder accesibilidad.

**Por qué:** afecta positivamente al caso manual 8 y cumple §5 (Accesibilidad).
**Alternativa descartada:** `outline: none` global. Falla la restricción de foco visible.

### D6. Color y contraste
**Elegido:** paleta clara con contraste AA aproximado para texto normal, estados semánticos por texto y forma (no solo color) para éxito/error, y uso de `aria-live` no incluido en esta etapa (pendiente de Etapa 2).

**Por qué:** cumple el criterio de Errores con texto y mejora la legibilidad.

### D7. Tipografía
**Elegido:** stack de fuentes del sistema (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`), sin descargar archivos de fuente externos.

**Por qué:** evita CDNs y reduce peso. Una fuente moderna viene del sistema operativo.

### D8. Densidad y espaciado
**Elegido:** escala espaciada basada en `0.25rem` para padding/margin, tarjetas con borde y sombra suave, formularios con etiquetas visibles y mensaje de error debajo del campo.

**Por qué:** identidad coherente y separación visual clara.

### D9. Sin cambios de selectores base
**Elegido:** no se modifican las reglas del HTML referidas en `puntos-de-enganche-libreria`.

**Por qué:** la Etapa 2 añadirá JavaScript que depende de esos `id`/clases. Cambiarlos ahora rompería la trazabilidad.

## Risks / Trade-offs

- **[Scroll horizontal accidental por contenido ancho (imágenes grandes)]** → Mitigación: `max-width: 100%` y `height: auto` para imágenes; pruebas manuales a 320/1280.
- **[Contraste insuficiente en algún estado]** → Mitigación: verificar ratios con DevTools; textos de error adicionales además del color.
- **[Posible conflicto visual con las maquetas futuras]** → Mitigación: usar clases existentes como único punto de enganche; mantener tokens centralizados.
- **[Sin JS todavía, el estado vacío y los mensajes dependen del navegador]** → Aceptado, se documenta en README; la Etapa 2 agregará `hidden` dinámico.

## Migration Plan

1. Crear `css/` y `css/estilos.css` con tokens y estilos base.
2. Vincular la hoja en el `<head>` de `index.html` (único cambio HTML).
3. Ejecutar verificación estática: búsqueda de `http://`/`https://`, ausencia de librerías, validación de enlaces.
4. Pruebas manuales en 320 px y 1280 px con DevTools (caso manual 8), checklist por vista.
5. **Rollback**: eliminar la carpeta `css/` y el `<link>`; el HTML vuelve a su estado previous, sin pérdida de datos (aún no hay datos persistidos).

## Open Questions

- **Paleta final**: usar un tema oscuro en lugar de claro. No condiciona la estructura ni los tasks; se resuelve antes de aplicar y se registra en la propuesta si cambia.
EOF