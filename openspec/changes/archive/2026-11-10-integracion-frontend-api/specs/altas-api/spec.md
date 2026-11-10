# Spec Delta

## Purpose

Permite registrar libros con stock y autorías y registrar clientes contra la API real, usando las consultas individuales de autores y clientes como selectores.

## ADDED Requirements

### Requirement: Opciones de los formularios

Los selectores de editorial y género SHALL cargarse desde `GET /editoriales/` y `GET /generos/`, SHALL usar los identificadores de la API como valor y SHALL informar si no se pudieron cargar.

#### Scenario: Carga de editoriales y géneros

- **WHEN** se abre la vista de alta de libros
- **THEN** los selectores se completan con los registros de la API y no con datos locales

#### Scenario: Falla al cargar opciones

- **WHEN** la consulta de editoriales o géneros falla
- **THEN** se muestra un aviso y el formulario no permite enviar un alta inconsistente

### Requirement: Alta de libro

El alta SHALL enviar `POST /libros/` con título, ISBN, precio positivo, stock entero desde cero, editorial y género opcional, y SHALL usar el registro devuelto para actualizar las vistas relacionadas.

#### Scenario: Alta exitosa

- **WHEN** el formulario es válido y la API responde 201
- **THEN** se muestra el libro creado, se actualiza el catálogo y se limpia el formulario

#### Scenario: ISBN repetido

- **WHEN** la API responde 409 por ISBN duplicado
- **THEN** se muestra el mensaje del servidor junto al formulario y el formulario conserva los valores ingresados

#### Scenario: Datos inválidos

- **WHEN** la API responde 422
- **THEN** se muestran los motivos devueltos por el servidor y no se agrega el libro al catálogo

#### Scenario: Precio o stock inválidos

- **WHEN** el precio no es mayor que cero o el stock no es un entero mayor o igual que cero
- **THEN** el alta se rechaza antes de enviar la petición

### Requirement: Autorías del libro

El alta SHALL exigir al menos una autoría y SHALL enviar por cada una `autor_id`, `rol` y `orden`, con `rol` limitado a autor, coautor, traductor o ilustrador y `orden` mayor o igual que uno.

#### Scenario: Varias autorías con roles distintos

- **WHEN** se agregan dos autores con roles autor y traductor
- **THEN** el cuerpo enviado contiene dos elementos con sus roles y órdenes

#### Scenario: Libro sin autorías

- **WHEN** no se agregó ninguna autoría
- **THEN** el alta se rechaza antes de enviar la petición

#### Scenario: Autor repetido

- **WHEN** se intenta agregar dos veces el mismo `autor_id`
- **THEN** se rechaza la segunda autoría y se informa el motivo

#### Scenario: Rol no permitido

- **WHEN** se envía un rol fuera de los cuatro admitidos
- **THEN** la API responde 422 y la interfaz muestra el mensaje del servidor

### Requirement: Verificación de autores por identificador

Como la API no expone un listado de autores, la interfaz SHALL verificar cada `autor_id` con `GET /autores/{id}` antes de agregarlo y SHALL mostrar su nombre.

#### Scenario: Autor existente

- **WHEN** se ingresa el identificador de un autor existente
- **THEN** se muestra su nombre y la autoría se agrega con ese identificador

#### Scenario: Autor inexistente

- **WHEN** el identificador consultado responde 404
- **THEN** se informa que el autor no existe y no se agrega la autoría

#### Scenario: Nombre recuperado

- **WHEN** el autor fue verificado
- **THEN** la tabla de autorías muestra el nombre junto al identificador, el rol y el orden

### Requirement: Alta de cliente

El alta SHALL enviar `POST /clientes/` con nombre y email, SHALL usar el registro devuelto y SHALL mostrar el mensaje del servidor ante 409 o 422.

#### Scenario: Alta exitosa

- **WHEN** el formulario es válido y la API responde 201
- **THEN** el cliente creado queda disponible para la venta y se muestra su identificador

#### Scenario: Email repetido

- **WHEN** la API responde 409
- **THEN** se muestra el mensaje del servidor y el formulario conserva los valores

#### Scenario: Email con formato inválido

- **WHEN** el email no tiene formato válido
- **THEN** el alta se rechaza antes de enviar la petición

### Requirement: Consulta individual de clientes

Como la API no expone un listado de clientes, la interfaz SHALL permitir buscar un cliente por identificador con `GET /clientes/{id}` y SHALL mostrar su nombre antes de usarlo en una venta.

#### Scenario: Cliente encontrado

- **WHEN** se busca el identificador de un cliente existente
- **THEN** se muestra nombre y email y el cliente queda disponible para la venta

#### Scenario: Cliente inexistente

- **WHEN** la búsqueda responde 404
- **THEN** se informa que el cliente no existe y no se agrega como seleccionable

#### Scenario: Clientes de la sesión

- **WHEN** se registran o consultan clientes durante la sesión
- **THEN** quedan disponibles como opciones de la venta sin volver a consultarlos
