# puntos-de-enganche-libreria Specification

## Purpose
Definir el contrato que la etapa 2 aplica encima del `index.html` sin reestructurar el documento: identificadores estables y únicos para enganchar el comportamiento, nombres de campo que calcan la entidad, contenedores de listado vacíos como destino de renderizado, selectores sin opciones de ejemplo, señalización en comentarios y `<noscript>`, y ausencia total de estilos, scripts y datos embebidos.

## Requirements

### Requirement: Identificadores estables y únicos para el enganche
Cada sección, formulario, campo, botón, tabla, `<tbody>` y contenedor de mensaje del documento SHALL tener un `id` propio, estable y no repetido, y el `href` de cada enlace del `<nav>` SHALL apuntar al `id` de su sección.

#### Scenario: Identificadores sin duplicados
- **WHEN** se listan todos los atributos `id` del documento
- **THEN** no hay dos elementos con el mismo `id`

#### Scenario: Enlaces del nav resueltos
- **WHEN** se compara cada `href` ancla del `<nav>` con los `id` del documento
- **THEN** cada ancla corresponde a un `id` existente

#### Scenario: Cada destino de render tiene un id
- **WHEN** se inspecciona la vista de Catálogo
- **THEN** existen el contenedor del listado de libros y los dos contenedores de mensaje (lista vacía y sin resultados) como elementos con `id` propio

#### Scenario: Etiquetas de las cinco vistas con id
- **WHEN** se inspecciona el `<nav>` y las cinco `<section>`
- **THEN** los `id` de las secciones son `catalogo`, `libros`, `clientes`, `ventas` y `historial`

### Requirement: Nombres de campo que calcan la entidad
Cada control de entrada SHALL tener un atributo `name` que coincida con el nombre del atributo de la entidad a la que pertenece, de modo que la lectura del valor de un campo sea directa para quien implemente la etapa 2.

#### Scenario: Campos del alta de libros
- **WHEN** se inspeccionan los `name` del formulario de alta de libros
- **THEN** son `titulo`, `isbn`, `precio`, `editorial`, `genero` y `autores`

#### Scenario: Campos del alta de clientes
- **WHEN** se inspeccionan los `name` del formulario de alta de clientes
- **THEN** son `nombre` y `email`

#### Scenario: Campos del formulario de venta
- **WHEN** se inspeccionan los `name` del formulario de venta
- **THEN** son `cliente`, `libro` y `cantidad`

#### Scenario: Campo de búsqueda del catálogo
- **WHEN** se inspecciona el `name` del campo del buscador del catálogo
- **THEN** es `busqueda`

### Requirement: Los listados y tablas quedan vacíos como destino de render
Los listados y todas las tablas de datos del documento SHALL aparecer sin filas de contenido: la lista del catálogo SHALL ser un elemento vacío y cada tabla SHALL tener su `<thead>` completo y su `<tbody>` presente pero sin filas.

#### Scenario: Catálogo sin libros de ejemplo
- **WHEN** el usuario abre la vista de Catálogo
- **THEN** el contenedor del listado no contiene ningún libro

#### Scenario: Tablas con encabezado y cuerpo vacío
- **WHEN** se inspecciona la tabla de libros registrados
- **THEN** tiene su `<thead>` con todas las columnas y un `<tbody>` presente sin ninguna fila

#### Scenario: Ningún dato de ejemplo embebido
- **WHEN** se busca en el documento un libro, editorial, género, autor o cliente de ejemplo
- **THEN** no aparece ninguno, porque ningún registro está escrito en el HTML

### Requirement: Selectores sin opciones de ejemplo
Los selectores de editorial, género, autores, cliente y libro SHALL contener únicamente una opción placeholder con `value` vacío, y SHALL NOT contener opciones con datos de ejemplo.

#### Scenario: Editorial sin opciones de ejemplo
- **WHEN** el usuario abre el selector de editorial del alta de libros
- **THEN** la única opción es la placeholder que invita a elegir una editorial, sin nombres de editoriales

#### Scenario: Sin opciones de ejemplo en cliente ni libro
- **WHEN** el usuario abre el selector de cliente o el selector de libro del formulario de venta
- **THEN** cada uno muestra solo su opción placeholder

### Requirement: El selector de género conserva la ausencia de género
El selector de género del alta de libros SHALL incluir una opción con `value` vacío cuyo texto sea literalmente `Sin clasificar`, en lugar de la opción placeholder genérica.

#### Scenario: Opción Sin clasificar presente y primera
- **WHEN** el usuario abre el selector de género del alta de libros
- **THEN** la primera opción dice `Sin clasificar` y su valor es vacío, y representa la ausencia de género

### Requirement: Señalización en comentarios y noscript de los puntos de enganche
El documento SHALL señalar con comentarios HTML en el código fuente cada punto donde la etapa 2 insertará contenido o enlazará eventos, y SHALL incluir un bloque `<noscript>` que explique al usuario, en texto visible, que los listados y las operaciones requieren JavaScript, reflejando el estado real de implementación.

#### Scenario: Comentarios en los destinos de render
- **WHEN** se lee el código fuente del documento
- **THEN** hay un comentario junto a la lista del catálogo, junto a cada `<tbody>` y junto a cada grupo de contenedores de mensaje

#### Scenario: Aviso visible sin JavaScript
- **WHEN** el usuario abre el proyecto con JavaScript deshabilitado
- **THEN** ve un aviso de texto que explica que los listados y las operaciones requieren JavaScript, que sin él solo se ve la estructura de las cinco vistas, y que ninguna operación del alcance del TPI queda pendiente

### Requirement: Honestidad sobre lo que todavía no funciona
El documento SHALL NOT afirmar en falso que una operación funciona y SHALL NOT contener un cartel que anuncie el estado de la implementación cuando no queda ninguna operación pendiente dentro del alcance del TPI; el estado real de la entrega se documenta en el README.

#### Scenario: Sin cartel de estado
- **WHEN** el usuario abre la aplicación
- **THEN** no encuentra ningún aviso que enumere las operaciones disponibles, porque dentro del alcance del TPI no queda ninguna pendiente

#### Scenario: Sin promesas obsoletas en los textos estáticos
- **WHEN** se leen las descripciones de las vistas y los textos por defecto de los contenedores de mensaje
- **THEN** no afirman que una operación está pendiente cuando ya funciona, ni prometen que "en la etapa 2" se informará un dato que el sistema ya informa

#### Scenario: Sin marcadores que dependan de estilos
- **WHEN** se inspecciona el código fuente
- **THEN** los avisos de pendiente se expresan con texto y comentarios, y no con clases que solo tengan sentido si existe una hoja de estilos

#### Scenario: Textos de estado coherentes en todo el documento
- **WHEN** se revisan el bloque `<noscript>` y el pie de página
- **THEN** ninguno de ellos afirma que la persistencia con `localStorage` esté pendiente, porque ya está implementada

### Requirement: Documento sin URLs externas ni datos embebidos
El documento SHALL NOT referenciar ninguna URL `http`/`https`, y SHALL NOT contener datos de libros, clientes ni ventas escritos en el HTML.

#### Scenario: Sin URLs externas
- **WHEN** se busca `http://` o `https://` en todos los archivos del proyecto
- **THEN** no hay ninguna coincidencia

#### Scenario: Estructura de una vista completa
- **WHEN** el usuario abre la vista de Ventas
- **THEN** encuentra el selector de cliente, los controles de agregar renglón con libro y cantidad, la tabla de renglones con su total, el botón de confirmar y los contenedores de mensaje, aunque vacíos

### Requirement: Clases reducidas a un vocabulario reutilizable
El documento SHALL usar un conjunto reducido de clases compartidas por elementos equivalentes (vista, formulario, campo, control, botón, mensaje, tabla, contenedor de tabla, tarjeta) y SHALL NOT usar clases cuyo único propósito sea marcar pendientes de una hoja de estilos que ya no existe.

#### Scenario: Elementos equivalentes con la misma clase
- **WHEN** se inspeccionan los botones de las distintas vistas
- **THEN** comparten la misma clase base de botón

#### Scenario: Sin clases de pendiente
- **WHEN** se busca en el documento una clase de botón "pendiente" o una clase de etiqueta de pendiente
- **THEN** no hay ninguna coincidencia
