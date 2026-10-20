# Spec Delta

## MODIFIED Requirements

### Requirement: Honestidad sobre lo que todavía no funciona
El documento SHALL indicar de forma visible y textual el estado real de implementación: qué operaciones están disponibles y cuáles todavía son pendientes, sin afirmar en falso que ninguna funciona y sin depender de estilos, colores ni distintivos gráficos para comunicarlo.

#### Scenario: Aviso de etapa en el documento
- **WHEN** el usuario abre la aplicación
- **THEN** encuentra un aviso de texto que identifica correctamente las operaciones disponibles (catálogo con filtro, altas de libros y clientes, venta con historial y persistencia con `localStorage`) y las que siguen pendientes (ninguna del alcance del TPI)

#### Scenario: Sin promesas obsoletas en los textos estáticos
- **WHEN** se leen las descripciones de las vistas y los textos por defecto de los contenedores de mensaje
- **THEN** no afirman que una operación está pendiente cuando ya funciona, ni prometen que "en la etapa 2" se informará un dato que el sistema ya informa

#### Scenario: Sin marcadores que dependan de estilos
- **WHEN** se inspecciona el código fuente
- **THEN** los avisos de pendiente se expresan con texto y comentarios, y no con clases que solo tengan sentido si existe una hoja de estilos

#### Scenario: Textos de estado coherentes en todo el documento
- **WHEN** se revisan el aviso de estado, el bloque `<noscript>` y el pie de página
- **THEN** ninguno de ellos afirma que la persistencia con `localStorage` esté pendiente, porque ya está implementada
