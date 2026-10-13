# Spec Delta

## Purpose

Definir el documento `index.html` del frontend de la librería como entrada única y autónoma: HTML semántico con las cinco vistas requeridas por el Ejercicio 1, navegación clara por anclas, formularios etiquetados, botones con texto descriptivo, tablas con encabezados y contenedores de mensaje para los estados que la consigna exige comunicar.

## ADDED Requirements

### Requirement: Entrada única y autónoma por index.html
El proyecto SHALL provide toda su interfaz desde un único archivo `index.html`, abierto por doble clic en el navegador, sin servidor, sin `package.json` y sin dependencias instaladas.

#### Scenario: Apertura local del proyecto
- **WHEN** el usuario abre `index.html` con doble clic desde el explorador de archivos
- **THEN** las cinco vistas se muestran completas en el navegador
- **AND** no se realiza ninguna petición de red

#### Scenario: Entrega sin carpetas de estilo ni script
- **WHEN** se revisa el contenido del proyecto
- **THEN** no existen carpetas `css/` ni `js/`, porque esta etapa no incluye estilos ni comportamientos

### Requirement: Documento semántico con las cinco vistas
El documento SHALL usar `<header>`, `<nav>` y `<main>` como contenedores principales, y SHALL representar cada una de las cinco vistas (Catálogo, Libros, Clientes, Ventas, Historial) como una `<section>` identificada, con su `<h2>` y su `aria-labelledby` apuntando a ese `<h2>`.

#### Scenario: Estructura del documento
- **WHEN** se inspecciona la estructura del documento
- **THEN** existe un `<header>` que contiene un `<nav>` y un `<main>` que contiene cinco `<section>`, una por vista

#### Scenario: Etiqueta accesible de cada vista
- **WHEN** se inspecciona una `<section>` de vista
- **THEN** su atributo `aria-labelledby` referencia el `id` de su propio `<h2>`

#### Scenario: Título de la librería visible
- **WHEN** el usuario abre la aplicación
- **THEN** el `<header>` muestra el título de la librería

### Requirement: Navegación clara entre las cinco vistas
El `<nav>` SHALL ofrecer un enlace por cada vista que lleve a la sección correspondiente dentro del mismo documento, y el documento SHALL mantener su contenido en un único archivo en lugar de dividirlo en varias páginas.

#### Scenario: Llegada a una vista desde la navegación
- **WHEN** el usuario activa el enlace "Clientes" del `<nav>`
- **THEN** la vista de Clientes queda visible en la pantalla

#### Scenario: Vista directa por ancla
- **WHEN** el usuario abre `index.html#ventas` directamente
- **THEN** el navegador posiciona la vista de Ventas

#### Scenario: Enlace de salto al contenido
- **WHEN** el usuario recorre el documento con el teclado
- **THEN** el primer elemento enfocable es un enlace que permite saltar directamente al contenido principal

### Requirement: Campos de formulario etiquetados
Cada control de entrada de los formularios de las vistas Libros, Clientes y Ventas SHALL tener una etiqueta `<label>` asociada mediante `for`/`id`.

#### Scenario: Asociación de etiqueta y campo
- **WHEN** se inspecciona un formulario de alta
- **THEN** cada control de entrada tiene un `<label for>` cuyo valor coincide con el `id` del control

#### Scenario: Etiqueta que nombra al campo
- **WHEN** se lee el texto de la etiqueta de un campo de precio
- **THEN** nombra explícitamente el dato que se solicita

### Requirement: Botones con texto que describe la acción
Cada botón del documento SHALL mostrar un texto que describa la operación que ejecuta, en lugar de textos genéricos como "OK" o "Enviar".

#### Scenario: Botón de alta de libros
- **WHEN** se inspecciona el formulario de alta de libros
- **THEN** el botón de envío dice "Agregar libro"

#### Scenario: Botón de la búsqueda del catálogo
- **WHEN** se inspecciona el buscador de la vista de Catálogo
- **THEN** hay un botón cuyo texto dice "Buscar por título"

#### Scenario: Botones de la vista de Ventas
- **WHEN** se inspecciona el formulario de venta
- **THEN** hay un botón "Agregar renglón" y un botón "Confirmar venta", ninguno con texto genérico

### Requirement: Tablas de datos con encabezados
Toda tabla que represente datos de libros, clientes, renglones o ventas SHALL incluir un `<caption>` que la describa y un `<thead>` con un `<th scope="col">` por columna.

#### Scenario: Encabezado del listado de libros
- **WHEN** se inspecciona la tabla de libros registrados
- **THEN** existe un `<thead>` con un `<th>` por columna (Título, ISBN, Editorial, Género, Autores, Precio)

#### Scenario: Encabezado del historial de ventas
- **WHEN** se inspecciona la tabla de ventas registradas
- **THEN** existe un `<thead>` con columnas Identificador, Fecha, Cliente, Total y Detalle

#### Scenario: Totales de la venta fuera del cuerpo
- **WHEN** se inspecciona la tabla de renglones de la venta en curso y la del detalle de una venta
- **THEN** el total de la venta está en un `<tfoot>` y no en una fila de datos del `<tbody>`

### Requirement: Contenedores de mensaje para los estados que la consigna exige
Cada vista que lista información SHALL tener un contenedor destinado al mensaje de lista vacía; la vista de Catálogo SHALL tener además un contenedor destinado al mensaje de búsqueda sin resultados; y cada formulario de alta SHALL tener un contenedor para operación correcta y otro para operación rechazada.

#### Scenario: Mensaje de lista vacía en cada listado
- **WHEN** se inspecciona el listado de clientes registrados
- **THEN** existe un elemento contenedor destinado al mensaje de lista vacía de ese listado

#### Scenario: Mensaje de búsqueda sin resultados
- **WHEN** se inspecciona la vista de Catálogo
- **THEN** existe un elemento contenedor destinado al mensaje de búsqueda sin resultados, distinto del de lista vacía

#### Scenario: Mensajes de operación en cada alta
- **WHEN** se inspecciona el formulario de alta de libros
- **THEN** existen dos contenedores de mensaje distintos, uno para operación correcta y otro para operación rechazada

#### Scenario: Mensaje de error de la venta
- **WHEN** se inspecciona el formulario de venta
- **THEN** existe un contenedor de mensaje de venta rechazada, para los casos de venta sin cliente, sin renglones o con cantidades inválidas

### Requirement: Los errores se expresan con texto
El contenido de todo contenedor de mensaje SHALL ser texto legible que explique el estado o el motivo, y SHALL NOT depender únicamente del color para comunicarlo.

#### Scenario: Contenido textual del mensaje de rechazo
- **WHEN** se lee el contenedor de operación rechazada de una vista
- **THEN** contiene una frase que explica la situación, no un símbolo ni un color aislado

#### Scenario: Contenido textual de los mensajes de listado
- **WHEN** se leen los contenedores de lista vacía y de búsqueda sin resultados
- **THEN** cada uno contiene una frase que explica qué ocurrió