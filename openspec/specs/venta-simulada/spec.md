# venta-simulada Specification

## Purpose

Registrar ventas simuladas de la librería con renglones y totales, y conservar un historial cuyo detalle sea inmutable: el precio unitario se copia del catálogo al confirmar y nunca se relee después.

## Requirements

### Requirement: Renglones de la venta en curso
El formulario de venta SHALL permitir agregar renglones seleccionando un libro existente del catálogo y una cantidad entera mayor que cero, y SHALL mostrar en cada renglón el libro, la cantidad, el precio unitario y el subtotal.

#### Scenario: Agregar un renglón válido
- **WHEN** el usuario elige un libro del catálogo, indica la cantidad `2` y activa "Agregar renglón"
- **THEN** el renglón aparece en la tabla con el título del libro, la cantidad, el precio unitario del catálogo y el subtotal cantidad × precio

#### Scenario: Cantidad que no es entera positiva
- **WHEN** el usuario intenta agregar un renglón con cantidad `0`, `-3` o `1.5`
- **THEN** no se agrega el renglón y se muestra un mensaje de rechazo que explica con texto que la cantidad debe ser un número entero mayor que cero

### Requirement: Sin libros repetidos dentro de la misma venta
No SHALL existir dos renglones con el mismo libro en una misma venta: al intentar agregar un libro que ya tiene renglón, el sistema SHALL informar el duplicado con un mensaje de texto y SHALL NOT crear un segundo renglón.

#### Scenario: Intento de duplicado
- **WHEN** existiendo un renglón con "Cien años de soledad", el usuario intenta agregar de nuevo ese mismo libro
- **THEN** se muestra un mensaje que indica que el libro ya tiene un renglón y la tabla conserva un único renglón para ese libro

### Requirement: Edición y quitado de renglones antes de confirmar
Antes de confirmar, el usuario SHALL poder modificar la cantidad de un renglón desde su propia fila —recalculando subtotal y total al instante— y SHALL poder quitar un renglón de la venta.

#### Scenario: Cambiar la cantidad de un renglón
- **WHEN** el usuario cambia la cantidad de un renglón de `2` a `3` en el campo de la fila
- **THEN** el subtotal de ese renglón y el total de la venta se recalculan en vivo sin recargar la página

#### Scenario: Quitar un renglón
- **WHEN** el usuario activa "Quitar renglón" sobre un renglón
- **THEN** el renglón desaparece de la tabla y el total se recalcula

### Requirement: Cálculos con dos decimales
El subtotal de cada renglón SHALL calcularse como cantidad × precio unitario y el total de la venta SHALL ser la suma de los subtotales; todos los importes SHALL presentarse con dos decimales.

#### Scenario: Venta con dos renglones
- **WHEN** la venta en curso tiene 2 × un libro a $ 1500.00 y 1 × otro libro a $ 2000.00
- **THEN** los subtotales mostrados son `$ 3000.00` y `$ 2000.00` y el total es `$ 5000.00`

### Requirement: Validaciones al confirmar la venta
No SHALL registrarse una venta sin cliente seleccionado, sin al menos un renglón o con alguna cantidad inválida; cada rechazo SHALL informar el motivo con un mensaje de texto visible junto al formulario.

#### Scenario: Confirmar sin cliente
- **WHEN** el usuario confirma la venta teniendo renglones pero sin haber elegido cliente
- **THEN** la venta no se registra, el historial no cambia y se muestra el mensaje que indica que debe seleccionarse un cliente

#### Scenario: Confirmar sin renglones
- **WHEN** el usuario confirma con cliente elegido pero sin renglones
- **THEN** la venta no se registra y se muestra el mensaje que indica que la venta debe tener al menos un renglón

#### Scenario: Confirmar con una cantidad inválida en una fila
- **WHEN** el usuario dejó una cantidad inválida (por ejemplo `0`) en un renglón y confirma
- **THEN** la venta no se registra y se muestra el mensaje que identifica el renglón con la cantidad inválida

### Requirement: Confirmación con copia histórica del precio unitario
Al confirmar una venta válida, el sistema SHALL registrar la venta con identificador, fecha, cliente, renglones y total, COPIANDO en cada renglón el título y el precio unitario del catálogo en ese momento; luego SHALL limpiar el formulario, mostrar un mensaje de éxito y reflejar la venta en el historial sin recargar la página.

#### Scenario: Confirmar una venta válida
- **WHEN** el usuario confirma una venta con cliente, dos renglones válidos y cantidades correctas
- **THEN** se registra la venta con los precios copiados, el formulario queda limpio para una nueva venta y el historial muestra la venta nueva con su identificador, fecha, cliente y total

### Requirement: Historial con detalle inmutable
El historial SHALL listar cada venta con identificador, fecha, cliente y total, y SHALL permitir consultar el detalle de sus renglones; el detalle SHALL armarse únicamente con los datos guardados en la venta y SHALL NOT releer precios del catálogo actual, de modo que un cambio posterior de precio no altere la venta registrada.

#### Scenario: El precio del catálogo cambia después de confirmar
- **WHEN** habiéndose confirmado una venta con un renglón a $ 1500.00, el precio de ese libro en el catálogo pasó a $ 9999.00 y el usuario vuelve a abrir el detalle de la venta
- **THEN** el detalle muestra el precio unitario histórico de `$ 1500.00` y sus subtotales y total sin cambios

### Requirement: Las ventas confirmadas no se editan ni se eliminan
La interfaz del historial SHALL ofrecer únicamente la consulta del detalle; SHALL NO disponer de controles para modificar ni eliminar una venta ya confirmada.

#### Scenario: Controles disponibles en el historial
- **WHEN** el usuario revisa el listado de ventas confirmadas
- **THEN** cada fila ofrece solo la acción de ver el detalle, sin botones de edición ni de eliminación
