# Spec Delta

## Purpose

Conservar en el navegador los libros, clientes y ventas de la librería mediante `localStorage`, sembrando los datos de ejemplo una sola vez, restaurándolos al reabrir la página y recuperándose de forma segura cuando el almacenamiento esté ausente o corrupto.

## ADDED Requirements

### Requirement: Persistencia de libros, clientes y ventas
El sistema SHALL guardar en `localStorage` los libros, los clientes y las ventas del usuario, y SHALL restaurarlos al volver a abrir la aplicación, de modo que un alta o una venta confirmada sobrevivan a una recarga de la página.

#### Scenario: Un libro dado de alta sobrevive a la recarga
- **WHEN** el usuario registra un libro nuevo y luego recarga la página
- **THEN** el listado de libros registrados y el catálogo vuelven a mostrar ese libro con sus mismos datos, y el selector de libros de la vista Ventas lo incluye

#### Scenario: Un cliente dado de alta sobrevive a la recarga
- **WHEN** el usuario registra un cliente nuevo y luego recarga la página
- **THEN** el listado de clientes registrados vuelve a mostrar ese cliente con su mismo nombre y correo, y el selector de clientes de la vista Ventas lo incluye

#### Scenario: Una venta confirmada sobrevive a la recarga
- **WHEN** el usuario confirma una venta y luego recarga la página
- **THEN** el historial vuelve a mostrar esa venta con su identificador, fecha, cliente y total, y su detalle conserva el precio unitario, los subtotales y el total con los valores de la venta

### Requirement: Siembra única de los datos de ejemplo
El sistema SHALL cargar los datos de ejemplo solo en la primera apertura y SHALL registrar una bandera de versión en `localStorage`; al reabrir la aplicación SHALL recuperar los registros guardados sin volver a sembrar ni duplicar los ejemplos.

#### Scenario: Primera apertura
- **WHEN** el usuario abre la aplicación por primera vez en un navegador sin datos guardados
- **THEN** el catálogo muestra los 6 libros de ejemplo, el listado de clientes muestra los 3 clientes de ejemplo y el historial está vacío, y queda guardada la bandera de versión

#### Scenario: Reapertura sin duplicar los ejemplos
- **WHEN** el usuario cierra y vuelve a abrir la aplicación con la bandera de versión ya guardada
- **THEN** el catálogo sigue mostrando los mismos 6 libros, los mismos 3 clientes y ninguna venta duplicada

#### Scenario: Versión de almacenamiento distinta a la actual
- **WHEN** la bandera de versión guardada en `localStorage` es diferente de la versión que usa la aplicación
- **THEN** la aplicación vuelve a sembrar los datos de ejemplo desde cero y actualiza la bandera de versión guardada

### Requirement: Estructura identificable del catálogo guardado
El catálogo guardado SHALL estar bajo una clave de `localStorage` conocida y documentada, como un arreglo de objetos de libro que incluya el título, el ISBN, el precio, la editorial, el género y los autores, de modo que el precio de un libro guardado pueda modificarse desde las herramientas de almacenamiento del navegador para comprobar la conservación del precio histórico.

#### Scenario: Modificar el precio del catálogo guardado
- **WHEN** el usuario modifica en `localStorage` únicamente el precio de un libro del catálogo guardado, sin tocar las ventas guardadas, y recarga la página
- **THEN** el catálogo muestra el nuevo precio del libro y el detalle de la venta confirmada con ese libro conserva el precio unitario, el subtotal y el total de la venta original

#### Scenario: La estructura guardada permite identificar cada libro
- **WHEN** se inspecciona el contenido guardado de la clave del catálogo
- **THEN** es un arreglo JSON en el que cada elemento corresponde a un libro e incluye su título y su precio, y las ventas guardadas se encuentran en otra clave

### Requirement: Recuperación segura ante datos ausentes o corruptos
Si el contenido guardado en `localStorage` no existe, no se puede interpretar o no tiene la forma esperada, el sistema SHALL restaurar los datos de ejemplo y SHALL seguir funcionando con normalidad, sin errores que impidan usar la aplicación.

#### Scenario: Contenido guardado que no se puede interpretar
- **WHEN** el contenido de una clave de `localStorage` del proyecto es un texto que no es JSON válido y se abre la aplicación
- **THEN** la aplicación carga los datos de ejemplo, muestra un aviso de texto que informa que los datos guardados no se pudieron leer y permite operar con normalidad

#### Scenario: Contenido guardado con la forma incorrecta
- **WHEN** una clave de `localStorage` contiene un JSON válido pero con una estructura que no corresponde a un arreglo de libros, clientes o ventas
- **THEN** la aplicación descarta ese contenido, vuelve a sembrar los datos de ejemplo y no falla al renderizar el catálogo, los listados ni el historial

### Requirement: Los datos literales no se persisten
El sistema SHALL mantener `editoriales`, `géneros` y `autores` como datos fijos en el código, sin guardarlos en `localStorage`, porque no se administran desde la interfaz y no cambian entre aperturas.

#### Scenario: Los selectores ofrecen siempre los mismos literales
- **WHEN** el usuario abre la aplicación, registra un libro, recarga la página y vuelve a abrir el selector de editorial
- **THEN** el selector ofrece las mismas editoriales del primer inicio y el contenido guardado en `localStorage` no incluye arreglos de editoriales, géneros ni autores
