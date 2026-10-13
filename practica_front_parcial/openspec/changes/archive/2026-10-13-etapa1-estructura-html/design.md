# Design — Etapa 1 reducida a estructura HTML

## Context

Ver `proposal.md` para la motivación. El estado concreto que condiciona el diseño:

- `index.html` actual (22,7 KB, 454 líneas): 5 vistas completas y navegables, datos de ejemplo estáticos (~11 KB), `<link>` a `css/estilos.css` y `<script>` a `js/filtro-catalogo.js`. Los `id` existentes siguen una convención consistente `vista-campo` (`libro-titulo`, `cliente-nombre`, `venta-cantidad`).
- `css/estilos.css` (11,3 KB): identidad visual, Flexbox/Grid, breakpoints, foco visible.
- `js/filtro-catalogo.js` (3,1 KB): filtro por título funcional (`trim`, `toLowerCase`, subcadena, `preventDefault`).
- `README.md` (11,7 KB): documenta un alcance que ya no aplica.
- `openspec/specs/` está vacío: no hay capacidades sincronizadas. El change `etapa1-maquetacion-libreria` sigue sin archivar, con sus 4 delta specs en conflicto con el alcance nuevo.
- Restricción dura (`AGENTS.md` §2): HTML/CSS/JS nativos, sin librerías, sin frameworks, sin CDN, sin build tools, sin backend, sin `fetch`. Se abre con doble clic en `index.html` (`file://`).

Este documento cubre **cómo** queda el HTML; **qué** debe cumplir está en `specs/estructura-html-libreria/spec.md` y `specs/puntos-de-enganche-libreria/spec.md`.

## Goals / Non-Goals

**Goals:**

- Que la Etapa 2 aplique modelo de datos, render, altas, ventas y `localStorage` **sin crear ni un solo `id` nuevo**, y sin tocar la jerarquía de secciones.
- Preservar la convención de `id` ya probada en el change anterior, para que la familiaridad del HTML actual no se pierda.
- Eliminar de raíz todo lo que la Etapa 2 tendría que **borrar** después (datos de ejemplo, opciones de ejemplo en los selectores, marcadores de pendiente).
- Dejar el documento honesto: sin CSS y sin JS no puede aparentar tener comportamiento.

**Non-Goals:**

- No se escribe aquí la estructura del modelo de datos ni la de los archivos de la Etapa 2.
- No se preserva la apariencia visual: sin `css/estilos.css` el documento se ve como HTML puro. Eso es intencional.
- No se decide el contenido final del README de entrega (ver "Migration Plan").

## Decisions

### D1. Un solo `index.html` con anclas, sin dividir en páginas

**Elegido:** mantener las cinco vistas como `<section>` dentro de un único `<main>`, con `<nav>` de anclas. Igual que en `etapa1-maquetacion-libreria`.

**Por qué:** `AGENTS.md` §3 declara `index.html` como "entrada única" y los demás `.html` como opcionales. La Etapa 2 tendrá el estado en memoria y en `localStorage`; con un solo documento no hay que serializar estado entre páginas ni resolverTransferencia de contexto entre vistas. Además, `<header>`, `<nav>` y `<footer>` no se duplican.

**Alternativa descartada:** una página por vista. Aporta URLs reales pero duplica la navegación, complica el estado de la venta en curso y agrega archivos que `openspec` debe mantener sincronizados, sin ganar nada en la consigna.

### D2. Convención de `id`: `<vista>-<rol>` y destino de render con id propio

Se conserva la convención del HTML actual porque ya es consistente y legible:

| Vista | Elemento | `id` |
|---|---|---|
| — | enlace de salto | `saltar-al-contenido` |
| Catálogo | sección / `<h2>` | `catalogo` / `titulo-catalogo` |
| Catálogo | formulario de búsqueda | `formulario-busqueda` |
| Catálogo | campo / botón buscar / botón limpiar | `busqueda-titulo` / `boton-buscar` / `boton-limpiar-busqueda` |
| Catálogo | mensaje vacío / sin resultados | `mensaje-catalogo-vacio` / `mensaje-sin-resultados` |
| Catálogo | lista de libros | `lista-catalogo` |
| Libros | sección / `<h2>` / formulario | `libros` / `titulo-libros` / `formulario-alta-libro` |
| Libros | campos | `libro-titulo`, `libro-isbn`, `libro-precio`, `libro-editorial`, `libro-genero`, `libro-autores` |
| Libros | botón agregar | `boton-agregar-libro` |
| Libros | mensaje éxito / error / vacío | `mensaje-exito-libro` / `mensaje-error-libro` / `mensaje-libros-vacio` |
| Libros | tabla / cuerpo | `tabla-libros` / `cuerpo-libros` |
| Clientes | sección / `<h2>` / formulario | `clientes` / `titulo-clientes` / `formulario-alta-cliente` |
| Clientes | campos | `cliente-nombre`, `cliente-email` |
| Clientes | botón agregar | `boton-agregar-cliente` |
| Clientes | mensaje éxito / error / vacío | `mensaje-exito-cliente` / `mensaje-error-cliente` / `mensaje-clientes-vacio` |
| Clientes | tabla / cuerpo | `tabla-clientes` / `cuerpo-clientes` |
| Ventas | sección / `<h2>` / formulario | `ventas` / `titulo-ventas` / `formulario-venta` |
| Ventas | campos | `venta-cliente`, `venta-libro`, `venta-cantidad` |
| Ventas | botones | `boton-agregar-renglon`, `boton-confirmar-venta` |
| Ventas | renglones: tabla / cuerpo / total / vacío | `tabla-renglones` / `cuerpo-renglones` / `total-venta` / `mensaje-renglones-vacio` |
| Ventas | mensaje éxito / error | `mensaje-exito-venta` / `mensaje-error-venta` |
| Historial | sección / `<h2>` | `historial` / `titulo-historial` |
| Historial | tabla / cuerpo / vacío | `tabla-ventas` / `cuerpo-ventas` / `mensaje-historial-vacio` |
| Historial | detalle: bloque / resumen / tabla / cuerpo / total | `detalle-venta` / `detalle-venta-resumen` / `tabla-detalle-venta` / `cuerpo-detalle-venta` / `detalle-venta-total` |

**Cambios respecto del HTML actual:** se **agregan** los ids que faltaban y que la Etapa 2 necesitaría (`boton-buscar`, `boton-agregar-libro`, `boton-agregar-cliente`, `boton-agregar-renglon`, `boton-confirmar-venta`, `mensaje-renglones-vacio`, y los ids de tabla/cuerpo de las cinco tablas). Se **conservan** todos los ids de campo, formulario, sección y mensaje ya existentes, para no romper familiaridad ni referencias ya escritas.

**Por qué `<tbody>` con `id`:** el render de la Etapa 2 hace `cuerpo.replaceChildren(...)`. Con el `id` en el `<tbody>` —y no solo en la `<table>`— el selector es exacto y no depende del orden de los elementos hermanos. El `id` de la `<table>` sirve para el `caption` y para asociar el mensaje de lista vacía.

**Por qué prefijo de vista:** con cinco formularios y selectores que se repiten (`cliente-nombre` en alta de cliente vs. `venta-cliente` en la venta), el prefijo evita colisiones y hace que `getElementById` sea inequívoco sin depender de selectores contextuales frágiles.

### D3. `name` de campo = atributo de la entidad

`titulo`, `isbn`, `precio`, `editorial`, `genero`, `autores`, `nombre`, `email`, `cliente`, `libro`, `cantidad`, `busqueda`.

**Por qué:** la Etapa 2 lee el valor con `form.elements.campo.value` o `querySelector('[name="campo"]')`. Calcar la entidad evita un diccionario de traducción y hace que el código de la Etapa 2 se lea como la consigna. `autores` va en el `<select multiple>`, así que se lee con `selectedOptions`.

**Alternativa descartada:** conservar los `name` actuales con guion (`libro-titulo`), que duplican el prefijo del `id` sin agregar información.

### D4. Tablas con `<thead>` completo y `<tbody>` vacío

**Elegido:** `<caption>` + `<thead>` completo + `<tbody id="…">` sin filas. Sin fila de ejemplo.

**Por qué:**
- La consigna (§4.6 y §12) dice que en etapa 1 los listados **pueden** usar datos estáticos de ejemplo: es opcional, no obligatorio. El usuario los eliminó explícitamente.
- Una fila de ejemplo sería un dato que la Etapa 2 tendría que borrar, y si sobrevive es un catálogo **hardcodeado** en HTML — justo lo que §6.3 prohíbe.
- Con `<tbody>` vacío se puede aprovechar el estado vacío real: los contenedores de mensaje de lista vacía quedan **visibles por defecto** (sin `hidden`), y así se cumple de verdad el requisito de §4.6 de incluir mensajes para listas vacías.
- `<tbody>` vacío es HTML válido; el navegador no inserta nada.

**Consecuencia para la Etapa 2:** el primer render debe ocultar `mensaje-*-vacio` cuando inserte filas y mostrarlo cuando quite la última. Queda anotado como requisito del change de etapa 2, no de este.

**Alternativa descartada:** dejar una fila de ejemplo "—" para que la tabla no se vea rota. Se descartó porque presenta como dato algo que no existe y agrega ruido que hay que remover.

### D5. `<select>` solo con placeholder, salvo la excepción de género

**Elegido:**
- `libro-editorial`: una `<option value="">Elegí una editorial</option>`.
- `libro-genero`: una `<option value="">Sin clasificar</option>` **y nada más**.
- `libro-autores` (`multiple`, `size="4"`): **sin** opciones; se conserva el `size` para que el control sea utilizable por teclado cuando la Etapa 2 lo poble.
- `venta-cliente`: una `<option value="">Elegí un cliente</option>`.
- `venta-libro`: una `<option value="">Elegí un libro</option>`.

**Por qué:** §7.1 exige que los selectores **se generen desde los datos locales**. Escribir 2 editoriales, 2 géneros y 3 autores a mano en el HTML produce exactamente lo que la etapa 2 debe reemplazar, y además fija un `value` (`1`, `2`, `l1`…) que no corresponde al identificador estable que usará el modelo de datos real.

**La excepción de género:** `Sin clasificar` con `value=""` no es un dato, es la **representación de la ausencia de género**, exigida literalmente por §4.1 y §7.1. Es el único valor que tiene sentido regardless de qué géneros se siembren, así que es correcto que viva en el HTML estático. No debe llevar opción placeholder distinta.

**Nota de implementación:** el `<select multiple>` sin opciones tiene altura cero con `size="4"` solo en algunos navegadores; de ahí conservar `size="4"`. No se agrega texto de ayuda decorativo.

### D6. Señalización de pendientes en comentarios HTML + `<noscript>`, no en clases

**Elegido:** un comentario `<!-- ENGANCHE ETAPA 2: … -->` en cada punto de inserción (lista del catálogo, cada `<tbody>`, cada grupo de contenedores de mensaje, cada `<select>`) y un `<noscript>` visible al inicio de `<main>`.

**Por qué:** con el CSS eliminado, la señalización anterior (`class="pendiente"` en botones + `<span class="etiqueta etiqueta--pendiente">etapa 2</span>`) queda sin efecto visual: el texto "etapa 2" sobrevive pero sin estilo se lee como contenido de la etiqueta, no como un aviso. `AGENTS.md` §13.9 exige marcar lo pendiente **explícitamente**. Los comentarios lo hacen en el código, donde va a leerlo quien implemente la Etapa 2, y el `<noscript>` lo hace en pantalla, donde lo necesita quien evalúa.

**Se conserva además** un `<p role="note">` visible después del `<header>` que dice, en texto, que en esta etapa están construidas las cinco vistas pero **ninguna operación funciona todavía** y el filtro del catálogo aún no está implementado. Es el reemplazo del `aviso-maqueta` anterior y cumple §9.2.9 y §13.9.

**Alternativa descartada:** `<details>` por vista con el estado de avance. Ocupa espacio y esconde información relevante para la evaluación.

### D7. Vocabulario de clases reducido, no eliminado

**Elegido:** conservar un conjunto de clases base reutilizables — `vista`, `formulario`, `formulario__titulo`, `campo`, `campo__etiqueta`, `campo__control`, `boton`, `boton--principal`, `boton--secundario`, `tabla`, `tabla-envoltura`, `tabla__total`, `tarjeta`, `tarjeta__titulo`, `mensaje`, `mensaje--vacio`, `mensaje--alerta`, `mensaje--exito`, `mensaje--error`, `catalogo`, `libro`, `libro__titulo`, `libro__datos` — y **eliminar** las que pierden sentido: `pendiente`, `etiqueta--pendiente`, `etiqueta`, y los modificadores `vista--catalogo`/`vista--libros`/etc. (redundantes con el `id` de la sección).

**Por qué:** las clases no hacen nada visual ahora, pero son el gancho más barato para el CSS de la Etapa 2: si la hoja de estilos futura reutiliza estos nombres, el HTML de la Etapa 2 no cambia. Mantenerlas no cuesta nada. En cambio, mantener `pendiente` y `etiqueta--pendiente` sí cuesta: obligan a la Etapa 2 a borrarlas y sugieren un estado visual que ya no hay.

### D8. Tabla de clientes sin columna "Fecha de alta"

**Elegido:** la tabla de clientes queda con `Nombre completo` y `Correo electrónico`, igual que los campos del formulario.

**Por qué:** §7.2 define los campos del cliente exactamente así. Agregar una columna de fecha que ningún requirement pide introduce un dato que el modelo de datos de la Etapa 2 tendría que inventar. La fecha que la consigna necesita es la de la **venta** (§8.4), que ya tiene su columna en el historial.

### D9. README: se regenera, no se pospone

**Elegido:** reemplazar `README.md` por una versión corta de etapa 1 (≈1 página) que declare: cómo abrir el proyecto, qué contiene (`index.html` y nada más), qué **no** funciona todavía, que no hay CSS ni JavaScript, qué incluye la entrega y qué queda para la etapa 2.

**Por qué no posponerlo:** (a) `AGENTS.md` §9.2.9 exige, en un avance de etapa 1, identificar qué pantallas son maquetas y qué interacciones ya funcionan — con este change la respuesta es "ninguna interacción funciona", y eso hay que dejarlo escrito; (b) §9.3 exige honestidad de verificación; (c) el README actual describe un CSS, un filtro y datos de ejemplo que **van a dejar de existir**: dejarlo es peor que no tener README, porque afirma algo falso.

**Por qué no borrarlo:** `README.md` es entregable obligatorio (§3), y aunque en esta etapa no haya nada que documentar, el archivo tiene que existir y ser truthful.

## Risks / Trade-offs

- **[El HTML sin CSS se ve crudo y la entrega de etapa 1 pierde puntos del Ejercicio 2]** → Es una decisión consciente del usuario y ya está registrada en `proposal.md`. Mitigación: los ids, las clases base y los puntos de enganche quedan completos para que la Etapa 2 aplique la hoja de estilos encima sin tocar la estructura.
- **[La Etapa 2 podría necesitar un `id` no previsto y tener que agregarlo]** → Bajo riesgo: las decisiones D2 y D3 cubren sección, formulario, cada campo, cada botón, cada tabla, cada `<tbody>` y cada contenedor de mensaje. Agregar un `id` a un elemento que ya existe no altera la estructura ni requiere rediseño.
- **[Los contenedores de mensaje visibles por defecto pueden leerse como datos]** → El texto de los mensajes es explícito ("Todavía no hay libros registrados."), sin ambigüedad con registros reales.
- **[El `<select multiple>` de autores se ve sin altura al estar vacío]** → Aceptado en esta etapa; se resuelve en la Etapa 2 al poblarlo desde los datos.
- **[Quedan dos changes con alcances contradictorios en `openspec/changes/`]** → Se resuelve en "Migration Plan": descartar el change anterior después de aplicar este.
- **[Perder el filtro por título ya implementado]** → Se acepta. El change de Etapa 2 del filtro lo reconstruye contra el render desde datos, que es el diseño correcto según §6.3.

## Migration Plan

1. Implementar este change completa y verificado (ver `tasks.md`).
2. Regenerar el `README.md` corto de etapa 1.
3. **Rollback**: todo el cambio es reversible desde el contenido de `openspec/changes/etapa1-maquetacion-libreria` — el `index.html` anterior puede reconstruirse con `git checkout` si el repositorio se versiona, o desde el cambio archivado. No hay migraciones de datos porque no hay almacenamiento: `localStorage` todavía no se usa en el proyecto, así que **no hay estado de usuario que preservar ni migrar**.
4. **Change anterior**: una vez este change esté implementado y validado, **eliminar la carpeta `openspec/changes/etapa1-maquetacion-libreria/` sin archivar**. Archivar sincronizaría sus cuatro delta specs a `openspec/specs/` (`estructura-y-navegacion`, `maqueta-datos-ejemplo`, `identidad-visual-y-adaptabilidad`, `filtro-catalogo-por-titulo`), fijando como válidas la maqueta con datos de ejemplo, la identidad visual y el filtro, que este change acaba de retirar. Sus dos primeras quedarían además solapadas con `estructura-html-libreria` y `puntos-de-enganche-libreria`.
5. Los changes de etapa 2 (modelo de datos y siembra, render, altas, ventas e historial, `localStorage`, CSS, README final con los casos manuales) se planifican sobre la estructura que deja este change.

## Open Questions

Ninguno. Las decisiones con impacto estructural (página única vs. múltiples, `id`, `name`, tablas vacías, opciones de los selectores, formato del README) están resueltas arriba porque cambiarlas después alteraría el HTML ya escrito y el `tasks.md`.