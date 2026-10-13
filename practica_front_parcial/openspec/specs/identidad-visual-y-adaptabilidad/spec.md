# identidad-visual-y-adaptabilidad Specification

## Purpose
Definir la capa de presentación propia y reutilizable que el frontend de la librería aplica sobre la estructura HTML existente, garantizando identidad visual coherente, layout fluido, adaptación a distintos anchos y accesibilidad básica sin usar librerías, frameworks o recursos externos.

## Requirements

### Requirement: Hoja de estilos propia y local
El proyecto SHALL aplicar todos sus estilos desde una única hoja de estilos externa alojada dentro del propio proyecto, y SHALL NOT referenciar hojas de estilos, tipografías ni recursos CSS por URL externa o CDN. El documento `index.html` SHALL incluir el vínculo a esa hoja de estilos local y SHALL NOT contener estilos en línea para los elementos de la interfaz.

#### Scenario: Vínculo local al stylesheet
- **WHEN** se inspecciona el `<head>` de `index.html`
- **THEN** existe un `<link rel="stylesheet">` cuyo `href` apunta a un archivo dentro del proyecto
- **AND** no aparece ninguna URL `http://` ni `https://` en proveedores externos

#### Scenario: Sin dependencias externas
- **WHEN** se revisan los archivos del proyecto
- **THEN** no existe ninguna librería ni framework de CSS, ni carpeta `node_modules`

### Requirement: Identidad visual coherente
El sistema SHALL definir una identidad visual propia y consistente para las cinco vistas, aplicada por clases compartidas por elementos equivalentes, de modo que formularios, botones, tarjetas, mensajes y tablas mantengan colores, tipografía, espaciado y estados equivalentes en toda la aplicación.

#### Scenario: Equivalencia visual de elementos
- **WHEN** se comparan dos botones que cumplen la misma función visual en distintas vistas
- **THEN** comparten la misma clase base y presentan el mismo estilo base

#### Scenario: Estados de mensaje diferenciados
- **WHEN** el usuario ve un estado de éxito, error o lista vacía
- **THEN** cada estado se reconoce además por texto legible y no únicamente por el color

### Requirement: Layout fluido con Flexbox o Grid
El sistema SHALL organizar el contenido principal de cada vista mediante Flexbox o Grid, evitando depender del flujo por defecto de bloque para estructurar encabezado, navegación, rejillas de formulario/listado y agrupaciones de acciones.

#### Scenario: Encabezado y navegación organizados
- **WHEN** se visualiza la aplicación en cualquier ancho soportado
- **THEN** el encabezado y la navegación presentan una disposición estable sin superposición de elementos

#### Scenario: Rejilla de dos columnas responsive
- **WHEN** se muestra una vista con formulario y listado en paralelo
- **THEN** los paneles se organizan mediante un contenedor de layout flexible

### Requirement: Adaptabilidad a 320 px y 1280 px sin scroll horizontal de la página
La interfaz SHALL conservar textos y controles legibles y SHALL NOT producir desplazamiento horizontal de la página completa en anchos de 320 px ni de 1280 px. Si una tabla necesita más espacio horizontal, el desplazamiento SHALL ocurrir únicamente dentro de su contenedor.

#### Scenario: Vista angosta de 320 px
- **WHEN** la ventana del navegador se ajusta a 320 px de ancho
- **THEN** todos los textos y controles permanecen legibles y la página completa no presenta scroll horizontal

#### Scenario: Vista ancha de 1280 px
- **WHEN** la ventana del navegador se ajusta a 1280 px de ancho
- **THEN** la interfaz mantiene los mismos criterios de legibilidad y sin scroll horizontal de la página

#### Scenario: Tabla con desplazamiento propio
- **WHEN** una tabla excede el ancho disponible en cualquiera de los anchos anteriores
- **THEN** solo el contenedor de la tabla presenta scroll horizontal y la página no se desplaza

### Requirement: Foco visible y navegación por teclado
Los controles interactivos SHALL conservar un foco visible y SHALL ser recorribles mediante el teclado en el orden estructural del documento, sin depender exclusivamente de cambios de color para indicar el foco.

#### Scenario: Foco visible en controles
- **WHEN** el usuario navega por teclado (Tab) entre los controles de las vistas
- **THEN** cada control enfocado muestra un indicador de foco visible

#### Scenario: Uso sin ratón
- **WHEN** un usuario completa el recorrido de navegación y uso de formularios solo con teclado
- **THEN** puede activar vistas, campos, botones y selectores sin bloquearse

### Requirement: Imágenes con texto alternativo adecuado
Si el proyecto incorpora imágenes, las informativas SHALL tener texto alternativo (`alt`) descriptivo y las decorativas SHALL usar `alt=""` sin repetir información innecesaria. Este change SHALL NOT introducir imágenes de terceros sin registrar su procedencia en el README cuando corresponda.

#### Scenario: Imagen informativa con alt
- **WHEN** se incluye una imagen que aporta información
- **THEN** posee un atributo `alt` descriptivo y no vacío

#### Scenario: Imagen decorativa con alt vacío
- **WHEN** se incluye una imagen puramente decorativa
- **THEN** su atributo `alt` es exactamente `""`

EOF
