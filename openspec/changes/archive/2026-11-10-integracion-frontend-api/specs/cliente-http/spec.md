# Spec Delta

## Purpose

Centraliza el acceso HTTP del frontend a la API de la librería y traduce sus respuestas, incluidos los errores, a un contrato estable para las vistas.

## ADDED Requirements

### Requirement: URL base y rutas

El cliente HTTP SHALL usar `/api` como prefijo público único y SHALL conservar la barra final de las rutas que la API la declara, de modo que `/api/libros/` llegue a `/libros/` sin redirecciones.

#### Scenario: Ruta de colección con barra final

- **WHEN** la vista solicita el catálogo
- **THEN** la petición se envía a `/api/libros/` y no a `/api/libros`

#### Scenario: Ruta de detalle sin barra final

- **WHEN** la vista solicita un libro por identificador
- **THEN** la petición se envía a `/api/libros/{id}` sin barra final

#### Scenario: URL base en un único lugar

- **WHEN** cambia el prefijo público de la API
- **THEN** se modifica en un solo archivo de configuración y ninguna vista contiene rutas absolutas

### Requirement: Construcción de consultas

Las consultas de listado SHALL enviar `limit` y `offset` como parámetros, SHALL omitir los filtros vacíos y SHALL codificar los valores con caracteres especiales o acentos.

#### Scenario: Filtro por título con acentos y espacios

- **WHEN** se busca «cien años»
- **THEN** la consulta viaja codificada y la API recibe el texto sin alteraciones

#### Scenario: Sin filtro activo

- **WHEN** la búsqueda está vacía
- **THEN** la consulta no incluye el parámetro `titulo`

#### Scenario: Límites de paginación

- **WHEN** se solicita una página con `limit` fuera del rango 1 a 100
- **THEN** el cliente lo acota al rango admitido antes de enviar la petición

### Requirement: Interpretación de errores HTTP

El cliente SHALL distinguir los errores de validación (422), de conflicto (409), de recurso inexistente (404) y de falla del servidor (500), y SHALL exponer el mensaje del servidor cuando exista.

#### Scenario: Conflicto con mensaje del servidor

- **WHEN** la API responde 409 con `{"detail": "Ya existe un libro con ese ISBN"}`
- **THEN** la interfaz muestra ese texto y no un mensaje genérico

#### Scenario: Error de validación con detalle en lista

- **WHEN** la API responde 422 con `detail` como lista de errores
- **THEN** la interfaz muestra los mensajes de cada error en texto legible

#### Scenario: Error de validación con detalle en texto

- **WHEN** la API responde 422 con `detail` como texto
- **THEN** la interfaz muestra ese texto

#### Scenario: Error sin cuerpo utilizable

- **WHEN** la API responde 500 sin un `detail` interpretable
- **THEN** la interfaz muestra un mensaje genérico de falla del servidor

### Requirement: Fallas de conexión

Una falla de red o un tiempo de espera agotado SHALL producir un mensaje que indique que no se pudo conectar con el servidor, distinto del estado de lista vacía.

#### Scenario: API no disponible

- **WHEN** `fetch` rechaza la promesa por un error de red
- **THEN** la vista muestra «No se pudo conectar con el servidor» y no «No hay libros»

#### Scenario: Servidor lento

- **WHEN** una petición supera el tiempo de espera configurado
- **THEN** se cancela y se informa el mismo estado de conexión

### Requirement: Normalización de tipos de la API

Los importes que la API envía como texto decimal SHALL convertirse a número para los cálculos de la interfaz, y los identificadores numéricos SHALL normalizarse a texto para compararlos con los valores del DOM.

#### Scenario: Precio decimal como texto

- **WHEN** la API devuelve `"precio": "1500.00"`
- **THEN** la interfaz calcula subtotales con el número 1500 y muestra el importe formateado

#### Scenario: Comparación de identificadores

- **WHEN** el identificador devuelto por la API es el número 7 y el valor del selector es el texto `"7"`
- **THEN** la comparación por identificador encuentra el registro correcto

#### Scenario: Importe no numérico

- **WHEN** un importe llega vacío o no convertible
- **THEN** la interfaz muestra un marcador de importe no disponible en lugar de `NaN`
