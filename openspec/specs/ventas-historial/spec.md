# ventas-historial Specification

## Purpose
Permite componer y confirmar una venta contra la API, consultar el historial paginado y abrir el detalle con los importes históricos guardados en cada renglón.

## Requirements

### Requirement: Composición de la venta

La venta SHALL exigir un cliente verificado, al menos un renglón, cantidades enteras mayores que cero y un solo renglón por libro, y SHALL tomar el precio unitario del catálogo vigente solo como borrador.

#### Scenario: Agregar un renglón

- **WHEN** se elige un libro y una cantidad entera positiva
- **THEN** el renglón se agrega con su subtotal calculado sobre el precio del catálogo

#### Scenario: Libro repetido

- **WHEN** se intenta agregar un libro que ya está en la venta
- **THEN** se rechaza el renglón y se informa el motivo

#### Scenario: Cantidad inválida

- **WHEN** la cantidad es cero, negativa o no entera
- **THEN** el renglón no se agrega y se informa el motivo

#### Scenario: Quitar un renglón

- **WHEN** se quita un renglón
- **THEN** la tabla y el total se recalculan sin ese renglón

#### Scenario: Editar la cantidad

- **WHEN** se modifica la cantidad de un renglón existente
- **THEN** su subtotal y el total de la venta se actualizan

### Requirement: Confirmación de la venta

La confirmación SHALL enviar `POST /ventas/` con únicamente `cliente_id` y `renglones` compuestos por `libro_id` y `cantidad`, y SHALL usar el total y los renglones devueltos por el servidor como valores definitivos.

#### Scenario: Venta aceptada

- **WHEN** la API responde 201
- **THEN** se muestran el identificador y el total devueltos, se limpia el formulario y se actualiza el historial

#### Scenario: Envío en curso

- **WHEN** la petición está pendiente
- **THEN** el botón de confirmar queda deshabilitado y no se puede enviar dos veces

#### Scenario: Importes de la respuesta

- **WHEN** la respuesta incluye `precio_unitario`, `subtotal` y `total` como texto decimal
- **THEN** la confirmación muestra esos importes y no los calculados localmente

#### Scenario: Cuerpo enviado

- **WHEN** se confirma una venta con dos renglones
- **THEN** el cuerpo contiene solo `cliente_id` y los dos renglones con `libro_id` y `cantidad`

### Requirement: Rechazo de la venta

Ante un rechazo del servidor la interfaz SHALL conservar el borrador completo y SHALL mostrar el mensaje correspondiente a 409 o 422.

#### Scenario: Cliente o libro inexistente

- **WHEN** la API responde 409
- **THEN** se muestra el mensaje del servidor y los renglones y el cliente elegido se conservan

#### Scenario: Cuerpo inválido

- **WHEN** la API responde 422
- **THEN** se muestra el motivo devuelto y el borrador se conserva

#### Scenario: Falla de conexión

- **WHEN** la petición no llega al servidor
- **THEN** se informa el error de conexión y el borrador se conserva

### Requirement: Historial paginado

El historial SHALL consultar `GET /ventas/` con `limit` y `offset`, SHALL mostrar identificador, fecha, cliente y total, y SHALL habilitar la página siguiente solo cuando la cantidad de ventas recibidas sea igual al `limit`.

#### Scenario: Primera página del historial

- **WHEN** se abre el historial
- **THEN** se solicita `limit=20&offset=0` y se listan las ventas recibidas

#### Scenario: Historial vacío

- **WHEN** la API devuelve una lista vacía
- **THEN** se muestra el mensaje de historial vacío

#### Scenario: Avanzar de página

- **WHEN** la primera página devolvió 20 ventas
- **THEN** el control de página siguiente está habilitado y solicita `offset=20`

#### Scenario: Error al cargar el historial

- **WHEN** la consulta falla
- **THEN** se muestra el error y no el mensaje de historial vacío

### Requirement: Detalle histórico de la venta

El detalle SHALL consultarse con `GET /ventas/{id}` y SHALL mostrar fecha, cliente, renglones e importes tal como fueron registrados, sin recalcularlos con el precio actual del catálogo.

#### Scenario: Abrir el detalle

- **WHEN** el usuario solicita el detalle de una venta
- **THEN** se consulta `GET /ventas/{id}` y se muestran sus renglones con precio unitario y subtotal

#### Scenario: Precio del catálogo modificado

- **WHEN** el precio de un libro cambia después de la venta
- **THEN** el detalle sigue mostrando el precio unitario y el total registrados en la venta

#### Scenario: Detalle de una venta inexistente

- **WHEN** la consulta responde 404
- **THEN** se informa que la venta no existe y no se modifica el historial
