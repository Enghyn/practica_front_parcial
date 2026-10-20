# documentacion-y-verificacion Specification

## Purpose

Documentar el estado real de la entrega y registrar los resultados observados de los casos manuales de la consigna, de forma tal que cualquier lector pueda reproducir las comprobaciones, en particular la del precio histórico de una venta, y sepa qué funciona y qué queda pendiente.

## Requirements

### Requirement: README con el contenido obligatorio de cierre
El README SHALL identificar a quienes realizan el trabajo, SHALL explicar cómo abrir `index.html` en el navegador sin instalar nada, SHALL describir la navegación entre las vistas, SHALL listar las funcionalidades implementadas y las pendientes, SHALL indicar dónde están los datos iniciales, SHALL explicar cómo funciona `localStorage` y cuáles son sus límites, SHALL indicar la procedencia de las imágenes si las hay, y SHALL identificar qué pantallas son estructura y qué interacciones funcionan.

#### Scenario: Lector que abre la entrega por primera vez
- **WHEN** una persona abre el README sin haber visto el proyecto
- **THEN** encuentra los integrantes del trabajo, los pasos para abrir el proyecto sin npm, la descripción de las cinco vistas y su navegación, el listado de funcionalidades implementadas y pendientes, la ubicación de los datos iniciales, la explicación del funcionamiento y los límites de `localStorage` y la procedencia de las imágenes

#### Scenario: Reparto explícito entre lo que funciona y lo pendiente
- **WHEN** el README incluye la tabla de estado de pantallas e interacciones
- **THEN** la tabla marca la persistencia con `localStorage` como funcional y no la lista entre los pendientes

### Requirement: Registro de los resultados observados de los casos manuales
El README SHALL registrar, para cada uno de los ocho casos manuales de la consigna, el resultado real observado al ejecutarlo en el navegador, diferenciando lo esperado de lo observado, y SHALL NOT dar por aprobado ningún caso que no se haya ejecutado.

#### Scenario: Caso de búsqueda con parte del título en mayúsculas
- **WHEN** se ejecuta el caso 1 buscando una parte del título en mayúsculas, luego con la búsqueda vacía y luego con un texto inexistente
- **THEN** el README registra que las coincidencias se encontraron sin distinguir mayúsculas, que la búsqueda vacía muestra el catálogo completo y que la búsqueda inexistente muestra el mensaje de que no se encontraron resultados

#### Scenario: Recarga después de altas y de una venta
- **WHEN** se ejecuta el caso 7 registrando un libro, un cliente y una venta, y luego recargando la página
- **THEN** el README registra que los datos se recuperaron sin duplicar ni los ejemplos ni la venta

#### Scenario: Caso fallido
- **WHEN** alguno de los ocho casos no se puede ejecutar o no da el resultado esperado
- **THEN** el README lo describe con su resultado real y lo marca como pendiente o fallido, sin presentarlo como aprobado

### Requirement: Reproducibilidad de la comprobación del precio histórico
El README SHALL identificar el nombre exacto de las claves de `localStorage` donde se guarda el catálogo, los clientes y las ventas, SHALL describir la estructura del JSON guardado en cada clave y SHALL detallar los pasos para alterar únicamente el precio de un libro en el catálogo guardado y comprobar que la venta conserva sus importes.

#### Scenario: Docente que quiere reproducir la comprobación
- **WHEN** una persona sigue las instrucciones del README para modificar el precio de un libro en el catálogo guardado y recargar la página
- **THEN** puede localizar la clave y el elemento del catálogo que debe editar sin ayuda externa, y el detalle de la venta conserva el precio unitario, el subtotal y el total de la venta original

### Requirement: Verificación de accesibilidad y adaptabilidad documentada
El README SHALL registrar el resultado de la comprobación de navegación por teclado y de los anchos de 320 px y 1280 px, indicando si el foco es visible, si los controles son utilizables y si las tablas se desplazan dentro de su propio contenedor cuando lo necesitan.

#### Scenario: Comprobación en anchos restringidos
- **WHEN** se abre la aplicación a 320 px y a 1280 px de ancho y se recorren los controles con el teclado
- **THEN** el README registra el resultado observado de la legibilidad, del foco visible y del desplazamiento propio de las tablas
