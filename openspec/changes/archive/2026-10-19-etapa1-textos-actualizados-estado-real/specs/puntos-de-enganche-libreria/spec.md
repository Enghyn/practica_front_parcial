## MODIFIED Requirements

### Requirement: Honestidad sobre lo que todavía no funciona
El documento SHALL indicar de forma visible y textual el estado real de implementación: qué operaciones están disponibles y cuáles todavía son pendientes, sin afirmar en falso que ninguna funciona y sin depender de estilos, colores ni distintivos gráficos para comunicarlo.

#### Scenario: Aviso de etapa en el documento
- **WHEN** el usuario abre la aplicación
- **THEN** encuentra un aviso de texto que identifica correctamente las operaciones disponibles (catálogo con filtro y altas de libros y clientes) y las que siguen pendientes (venta, historial y persistencia)

#### Scenario: Sin promesas obsoletas en los textos estáticos
- **WHEN** se leen las descripciones de las vistas y los textos por defecto de los contenedores de mensaje
- **THEN** no afirman que una operación está pendiente cuando ya funciona, ni prometen que "en la etapa 2" se informará un dato que el sistema ya informa

#### Scenario: Sin marcadores que dependan de estilos
- **WHEN** se inspecciona el código fuente
- **THEN** los avisos de pendiente se expresan con texto y comentarios, y no con clases que solo tengan sentido si existe una hoja de estilos

### Requirement: Señalización en comentarios y noscript de los puntos de enganche
El documento SHALL señalar con comentarios HTML en el código fuente cada punto donde la etapa 2 insertará contenido o enlazará eventos, y SHALL incluir un bloque `<noscript>` que explique al usuario, en texto visible, que los listados y las operaciones requieren JavaScript, reflejando el estado real de implementación.

#### Scenario: Comentarios en los destinos de render
- **WHEN** se lee el código fuente del documento
- **THEN** hay un comentario junto a la lista del catálogo, junto a cada `<tbody>` y junto a cada grupo de contenedores de mensaje

#### Scenario: Aviso visible sin JavaScript
- **WHEN** el usuario abre el proyecto con JavaScript deshabilitado
- **THEN** ve un aviso de texto que explica que los listados y las operaciones requieren JavaScript y cuáles vistas son todavía pendientes
