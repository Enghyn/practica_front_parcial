# Spec Delta

## Purpose

Permite consultar el catálogo real de la librería con búsqueda y paginación, ver el detalle de autores bajo demanda y distinguir cada estado de la consulta.

## ADDED Requirements

### Requirement: Consulta paginada del catálogo

El catálogo SHALL consultar `GET /libros/` con `limit`, `offset` y el filtro `titulo`, SHALL usar un `limit` de 20 por omisión y SHALL determinar si existe página siguiente comparando la cantidad de elementos recibidos con el `limit` solicitado.

#### Scenario: Primera página

- **WHEN** se abre la vista de catálogo
- **THEN** se solicita `limit=20&offset=0` y se listan los libros recibidos

#### Scenario: Página siguiente disponible

- **WHEN** la API devuelve 20 libros para un `limit` de 20
- **THEN** el control de página siguiente queda habilitado

#### Scenario: Última página

- **WHEN** la API devuelve menos libros que el `limit` solicitado
- **THEN** el control de página siguiente queda deshabilitado

#### Scenario: Página anterior

- **WHEN** el desplazamiento es mayor que cero
- **THEN** el control de página anterior queda habilitado

### Requirement: Búsqueda por título

La búsqueda SHALL enviar el texto a la API mediante el parámetro `titulo`, SHALL ignorar mayúsculas y SHALL reiniciar el desplazamiento a cero al cambiar el filtro.

#### Scenario: Búsqueda con coincidencia parcial

- **WHEN** se escribe «aleph» en el buscador
- **THEN** se consulta la API con `titulo=aleph&offset=0` y se muestran los libros coincidentes

#### Scenario: Cambio de filtro en una página avanzada

- **WHEN** el usuario está en la tercera página y modifica el texto de búsqueda
- **THEN** la consulta vuelve a `offset=0`

#### Scenario: Limpiar la búsqueda

- **WHEN** se limpia el buscador
- **THEN** se vuelve a la primera página sin filtro por título

### Requirement: Contenido de la tarjeta de libro

Cada libro del catálogo SHALL mostrar título, ISBN, precio, editorial y género, y SHALL mostrar «Sin clasificar» cuando el género sea nulo o desconocido.

#### Scenario: Género nulo

- **WHEN** el libro recibido tiene `genero_id` nulo
- **THEN** la tarjeta muestra «Sin clasificar» en el campo género

#### Scenario: Editorial y género desde la referencia

- **WHEN** la API devuelve `editorial` y `genero` como objetos anidados
- **THEN** la tarjeta muestra sus nombres sin necesidad de otra petición

#### Scenario: Precio formateado

- **WHEN** el precio recibido es `"1350.50"`
- **THEN** la tarjeta lo muestra como importe con dos decimales

### Requirement: Autores bajo demanda

Los autores de un libro SHALL consultarse con `GET /libros/{id}` al solicitarlos, SHALL mostrarse con su nombre y rol, y SHALL evitarse la consulta repetida del mismo libro durante la sesión.

#### Scenario: Ver autores de un libro

- **WHEN** el usuario solicita ver los autores de un libro del catálogo
- **THEN** se consulta `GET /libros/{id}` y se muestran los autores con su rol

#### Scenario: Libro sin autores

- **WHEN** el detalle devuelve una lista de autores vacía
- **THEN** se informa que el libro no tiene autores registrados

#### Scenario: Segunda solicitud del mismo libro

- **WHEN** el usuario vuelve a solicitar los autores de un libro ya consultado
- **THEN** se muestran los datos en memoria sin repetir la petición

### Requirement: Estados de la consulta

La vista de catálogo SHALL distinguir cuatro estados: carga en curso, catálogo vacío, búsqueda sin coincidencias y error de conexión, y SHALL informar cada uno con un texto propio.

#### Scenario: Carga en curso

- **WHEN** la consulta está pendiente
- **THEN** se muestra un aviso de carga y no el mensaje de catálogo vacío

#### Scenario: Catálogo vacío

- **WHEN** la API devuelve una lista vacía sin filtro activo
- **THEN** se muestra el mensaje de catálogo vacío con la indicación de registrar un libro

#### Scenario: Búsqueda sin coincidencias

- **WHEN** la API devuelve una lista vacía con un filtro activo
- **THEN** se muestra el mensaje de búsqueda sin coincidencias

#### Scenario: Error de conexión

- **WHEN** la consulta falla por red o por error del servidor
- **THEN** se muestra el mensaje de error con la opción de reintentar
