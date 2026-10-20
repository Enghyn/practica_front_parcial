# Librería Aurora — Frontend de una librería (HTML, CSS y JavaScript nativos)

TPI de Programación III — Frontend de una librería.
Consigna oficial: `docs/Repaso Primer Parcial.pdf`.

---

## 1. Quiénes realizan el trabajo

| Integrante | Legajo |
|---|---|
| Fernando Torrez | 53988 |
| Ignacio Sánchez | 53966 |
| Agustín Contardi | 53863 |
| Enzo Giaquinta | 53884 |
| Ramiro Salcedo | 53992 |

## 2. Cómo abrir el proyecto

1. Abrí la carpeta del proyecto en el explorador de archivos.
2. Hacé **doble clic en `index.html`**.
3. Listo: se abre en el navegador.

No hace falta instalar nada. No hay `package.json`, ni `node_modules`, ni servidor, ni conexión a
internet: el proyecto se abre directamente con el protocolo `file://` y **no realiza ninguna petición
de red**.

Con JavaScript habilitado, los libros, clientes y ventas quedan guardados en el
**almacenamiento local del navegador** (`localStorage`) y se recuperan al volver a abrir la
página. Ver §9 para las claves exactas y los límites de este almacenamiento.

## 3. Qué contiene esta entrega

La entrega separa estructura, estilos y comportamiento en archivos propios:

- `index.html` — punto de entrada obligatorio con las **cinco vistas** del Ejercicio 1: Catálogo,
  Libros, Clientes, Ventas e Historial; navegación por anclas y un enlace de salto al contenido.
- `css/estilos.css` — identidad visual propia (colores, tipografía, tarjetas, formularios y botones)
  y layout con Flexbox/Grid, sin librerías ni CDN.
- `js/datos.js` — modelo de datos local: arrays con identificadores estables (`libros`,
  `editoriales`, `generos`, `autores`, `clientes`), la siembra mínima (6 libros, 2 editoriales,
  2 géneros, 3 autores y 3 clientes ficticios) y la lógica de siembra única / restauración.
- `js/persistencia.js` — acceso a `localStorage`: una clave por entidad, bandera de versión,
  lectura validada, escritura del estado y aviso por texto si el navegador bloquea el
  almacenamiento.
- `js/catalogo.js` — renderizado del catálogo desde el array de libros y filtro por título
  (trim, sin distinguir mayúsculas, coincidencias parciales).
- `js/altas.js` — altas de libros y clientes con `preventDefault`, validaciones, persistencia del
  cambio y actualización en vivo de listados y selectores relacionados.
- `js/ventas.js` — composición de la venta (renglones sin libros repetidos, cantidades enteras
  mayores que cero, edición de cantidades y quitar renglones antes de confirmar), validaciones al
  confirmar, registro en el historial **copiando el precio unitario al renglón** y detalle
  inmutable que nunca relee el catálogo.

`index.html` incluye:

- HTML semántico: `<header>`, `<nav>`, `<main>`, cinco `<section>` y `<footer>`.
- Todos los formularios con sus campos, cada uno con su `<label for>` asociado, y botones con texto
  que describe la acción.
- Las cinco tablas con `<caption>` y `<thead>` completo; los cuerpos de tabla de los listados se
  renderizan con JavaScript.
- Los contenedores de mensaje para los estados que la consigna exige comunicar: lista vacía,
  búsqueda sin resultados y operación correcta o rechazada.
- Un aviso de persistencia (`#aviso-persistencia`, oculto salvo que haya algo que informar), un
  bloque `<noscript>` con el aviso para quien abra el proyecto sin JavaScript y un pie de página.
  No hay un cartel de estado de la implementación: no queda ninguna operación pendiente dentro del
  alcance del TPI y el estado real se documenta en este README.

## 4. Qué pantallas son estructura y qué interacciones funcionan

Según `AGENTS.md` §9.2.9 y §9.3, se declara expresamente el estado real de la entrega:

| Elemento | Estado |
|---|---|
| Las 5 pantallas (Catálogo, Libros, Clientes, Ventas, Historial) | Estructura semántica lista. |
| Navegación por anclas y enlace de salto | **Funciona** (HTML puro). |
| Catálogo y filtro por título | **Funciona** (renderizado dinámico y actualización al agregar libros). |
| Formularios de alta de libros y clientes (Ejercicio 4) | **Funciona**: validación completa, prevención de duplicados (ISBN y email), selectores dinámicos, mensajes de éxito/error y actualización en vivo de listados y selectores sin recargar la página. |
| Composición y confirmación de la venta (Ejercicio 5) | **Funciona**: renglones con cantidad entera > 0, sin libros repetidos, edición y quitado de renglones, subtotales y total con dos decimales, y validaciones al confirmar. |
| Historial de ventas y detalle (Ejercicio 5) | **Funciona**: listado con id, fecha, cliente y total; el detalle se arma solo con los datos guardados en la venta (precio unitario copiado al confirmar), no con el catálogo actual. |
| Persistencia de datos en `localStorage` (Ejercicio 6) | **Funciona**: siembra única con bandera de versión, restauración al reabrir, escritura tras cada alta y tras cada venta, y caída segura ante datos ausentes o corruptos. |
| Altas de **editoriales, géneros y autores** | Fuera de alcance (§6.6 de la consigna): no se administran y por eso no se guardan. |

**Casos manuales de la §10:** los 8 casos se ejecutaron en el navegador y sus resultados
observados figuran en la §8, con fecha y navegador usado. Ningún caso se da por aprobado sin
haberse ejecutado (`AGENTS.md` §9.3).

## 5. Lo que todavía no funciona (pendientes)

- **Administración de editoriales, géneros y autores**: la consigna (§6.6) los deja fuera de
  alcance, así que no se pueden dar de alta, editar ni eliminar desde la interfaz.
- **Edición y eliminación de registros ya guardados** (libros, clientes y ventas): la consigna no
  las exige y no están implementadas. El historial de ventas es inmutable por diseño.
- **Cobros, stock y facturación fiscal**: fuera del alcance del TPI. La venta es una simulación que
  calcula importes.
- **Sincronización entre dispositivos o usuarios**: no existe; `localStorage` es local a un
  navegador y a un perfil (ver §9).

## 6. Alcance técnico

HTML, CSS y JavaScript nativos únicamente: no se usan librerías, frameworks, CDN, herramientas de
compilación, backend ni llamadas `fetch`. Todo el comportamiento corre en el navegador sobre datos
locales; esos datos se conservan en el **almacenamiento local del navegador (`localStorage`)**, que
es la única persistencia del proyecto y no implica ningún servidor.

## 7. Estructura del proyecto

```
index.html            ← punto de entrada
css/estilos.css       ← estilos propios (sin librerías ni CDN)
js/datos.js           ← datos locales, semilla inicial y restauración
js/persistencia.js    ← persistencia en localStorage (claves, versión, lectura y escritura)
js/catalogo.js        ← renderizado y filtro del catálogo
js/altas.js           ← altas de libros y clientes con validaciones
js/ventas.js          ← venta simulada, historial inmutable y detalle
README.md             ← este archivo
AGENTS.md             ← reglas del proyecto
docs/                 ← consigna oficial en PDF
openspec/             ← especificación de los cambios
```

No hay imágenes propias ni de terceros, así que no hay procedencia que acreditar.

## 8. Casos manuales ejecutados (§10 de la consigna)

**Cómo se ejecutaron.** Los 8 casos se ejecutaron el **20/10/2026** en **Google Chrome
155.0.8059.85**, sin interfaz gráfica, controlado con el protocolo de DevTools (CDP): se cargó la
página, se completaron los campos de cada formulario y se dispararon los envíos y los clics reales.
Se trabajó sobre una **copia de prueba** de la carpeta del proyecto, ubicada fuera de la entrega,
con un **perfil de navegador propio y limpio** para no mezclar los datos guardados con los del
equipo. Los guiones de automatización quedaron fuera del proyecto: la entrega no incluye ningún
runner ni dependencia (ver §6).

**Dónde se guardan los datos.** Bajo `file://` (`file:///…/index.html`, la forma real de abrir el
TPI con doble clic) Chrome **sí** habilita `localStorage` y la aplicación funciona con
persistencia completa. También se comprobó el mismo circuito servido por HTTP local
(`python -m http.server` en `http://127.0.0.1:8765/index.html`): también funciona, con las mismas
claves. Ojo: `file://` y `http://127.0.0.1` son **orígenes distintos** para el navegador, así que
cada uno tiene su propio almacenamiento: lo que se guardó en uno no aparece en el otro.

### Caso 1 — Búsqueda con parte del título en mayúsculas, búsqueda vacía y texto inexistente

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Búsqueda en mayúsculas | En el campo "Buscar por título": `AÑOS DE` | Coincidencias sin distinguir mayúsculas | **Coincide.** Se mostró 1 tarjeta: "Cien años de soledad" (6 libros en total, 1 coincidencia). El mensaje de "sin resultados" no apareció. |
| (b) Búsqueda vacía | `   ` (solo espacios) | Catálogo completo | **Coincide.** Volvieron las 6 tarjetas del catálogo; el mensaje de "sin resultados" siguió oculto. El `trim` de los extremos funciona. |
| (c) Búsqueda inexistente | `zzz-inexistente` | Mensaje claro de que no hay resultados | **Coincide.** 0 tarjetas visibles y mensaje visible: "No se encontraron libros que coincidan con la búsqueda. Probá con otro título o limpiá la búsqueda." |

### Caso 2 — Alta de libro con ISBN existente y luego con ISBN nuevo

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Libro con ISBN existente | Título "Libro de prueba duplicado"; ISBN `978-950-07-0011-0` (perteneciente a "Cien años de soledad"); precio 1000; editorial Sudamericana; sin género; un autor | Se rechaza el duplicado | **Rechazado.** Mensaje: "Operación rechazada: El ISBN ingresado ya existe en el sistema." El listado siguió con 6 filas y la clave `libreriaAurora:libros` siguió con 6 elementos: no se agregó el registro. |
| (b) Libro con ISBN nuevo | Título "Libro de prueba nuevo"; ISBN `999-000-0001-1`; precio 1234,56; editorial Planeta; género Novela; dos autores | Aceptado; aparece en catálogo y selección de venta | **Aceptado.** Mensaje: "Operación correcta: el libro "Libro de prueba nuevo" se registró exitosamente." El listado pasó a 7 filas, el catálogo a 7 tarjetas (con editorial, género, autores y precio $ 1234.56), el selector de libros de la vista Ventas pasó a 8 opciones (7 libros + "Elegí un libro") y `libreriaAurora:libros` quedó con 7 elementos, el último `{"id":"lib7_…","titulo":"Libro de prueba nuevo","isbn":"999-000-0001-1","precio":1234.56,"editorialId":"ed2","generoId":"gen1","autorIds":["aut2","aut3"]}`. |

**Desviación observada respecto de lo previsto:** se esperaba que "el selector de la vista Ventas
permanezca vacío". No es así: `js/altas.js` puebla los selectores de Ventas con los datos
sembrados al iniciar (7 libros y 3 clientes, más el placeholder) y los actualiza con cada alta. Es
el comportamiento exigido por `AGENTS.md` §7.3 ("el listado y las opciones relacionadas se
actualizan sin recargar la página"): la expectativa de la tarea estaba desactualizada, no es un
defecto del código.

### Caso 3 — Alta de cliente con email inválido, email existente en mayúsculas y email nuevo

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Email inválido | Nombre "Cliente de prueba"; email `no-es-un-email` | Se rechaza | **Rechazado.** Mensaje: "Operación rechazada: El correo electrónico no tiene un formato válido." El listado siguió con 3 filas. |
| (b) Email ya registrado, en mayúsculas | Nombre "Cliente de prueba"; email `ANA.PEREZ@EJEMPLO.COM` (registrado en minúsculas como ana.perez@ejemplo.com) | Se rechaza | **Rechazado.** Mensaje: "Operación rechazada: Ya existe un cliente registrado con ese correo electrónico." El listado siguió con 3 filas: la comparación se hizo con `trim()` y sin distinguir mayúsculas/minúsculas, así que detectó la duplicación pese a que el texto ingresado estaba en mayúsculas. |
| (c) Email nuevo | Nombre "Cliente de prueba"; email `cliente.nuevo@ejemplo.com` | Aceptado; aparece en el listado y en la selección | **Aceptado.** Mensaje: "Operación correcta: el cliente "Cliente de prueba" se registró exitosamente." El listado pasó a 4 filas, el selector de clientes de la vista Ventas pasó a 5 opciones y `libreriaAurora:clientes` quedó con 4 elementos. |

### Caso 4 — Venta sin cliente, cantidades inválidas y libro repetido

Se ejecutaron los cuatro puntos del caso; todos **rechazaron** la operación como se espera:

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Sin cliente | Un renglón válido (2 × "Cien años de soledad") y confirmar con el selector de cliente vacío | No se confirma | **No se confirmó.** Mensaje: "Operación rechazada: Debe seleccionar un cliente." El historial siguió con 0 ventas. |
| (b) Cantidad 0 | Cliente Ana Pérez; libro "Cien años de soledad"; cantidad `0` | No se agrega el renglón | **Rechazado.** Mensaje: "Operación rechazada: La cantidad debe ser un número entero mayor que cero." La tabla siguió con 1 fila (la que ya había). |
| (b) Cantidad negativa | Igual al anterior con cantidad `-3` | No se agrega el renglón | **Rechazado.** Mismo mensaje; la tabla no cambió. |
| (b) Cantidad decimal | Igual al anterior con cantidad `1.5` | No se agrega el renglón | **Rechazado.** Mismo mensaje; la tabla no cambió. |
| (c) Libro repetido | Agregar 2 × "Cien años de soledad" (aceptado) y luego 1 × el mismo libro | No se crea otro renglón; se informa el duplicado | **Rechazado.** Mensaje: 'Operación rechazada: El libro "Cien años de soledad" ya tiene un renglón en esta venta; modificá su cantidad en la tabla.' La tabla siguió con 1 fila. |
| (d) Sin renglones | Cliente Ana Pérez, 0 renglones, botón "Confirmar venta" | No se confirma | **No se confirmó.** Mensaje: "Operación rechazada: La venta debe tener al menos un renglón." El historial siguió con 0 ventas. |

Se verificó además el botón **"Quitar renglón"**: al quitar el único renglón la tabla quedó en 0
filas y el total en `$ 0.00`.

### Caso 5 — Venta válida: dos unidades a 1500 y una a 2000

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Composición | Cliente Ana Pérez; 2 × "Cien años de soledad" ($ 1500.00) y 1 × "Poemas de la soledad" ($ 2000.00) | Subtotales 3000.00 y 2000.00; total 5000.00 | **Coincide.** Filas de la tabla de renglones: "Cien años de soledad | 2 | $ 1500.00 | $ 3000.00" y "Poemas de la soledad | 1 | $ 2000.00 | $ 2000.00"; total de la tabla `$ 5000.00`. |
| (b) Edición de cantidad | Cambiar el primer renglón a 3 en el campo de la fila, y volver a 2 | Total recalculado en vivo | **Coincide.** Con 3 el total pasó a `$ 6500.00`; al volver a 2, `$ 5000.00`. El foco no se perdió al editar. |
| (c) Confirmación | Botón "Confirmar venta" | Mensaje de éxito; venta en el historial; formulario limpio | **Coincide.** Mensaje: 'Operación correcta: la venta "venta-1" se confirmó por $ 5000.00 y quedó registrada en el historial.' Historial con 1 fila (`venta-1 | 20/10/2026, 08:55 | Ana Pérez | $ 5000.00 | Ver detalle`); la tabla de renglones quedó en 0 filas y el total en `$ 0.00`. |
| (d) Detalle | Botón "Ver detalle" de la venta | Renglones con precio histórico y total conservados | **Coincide.** El `<details>` se abrió con resumen "Detalle de la venta venta-1 — Ana Pérez — 20/10/2026, 08:55" y filas: "Cien años de soledad | 2 | $ 1500.00 | $ 3000.00" y "Poemas de la soledad | 1 | $ 2000.00 | $ 2000.00"; total `$ 5000.00`. |
| (e) Guardado | Inspección de `libreriaAurora:ventas` | La venta guardada conserva el precio unitario copiado | **Coincide.** Contenido guardado: `[{"id":"venta-1","fecha":"2026-10-20T11:55:06.644Z","clienteId":"cli1","cliente":{"id":"cli1","nombre":"Ana Pérez","email":"ana.perez@ejemplo.com"},"renglones":[{"libroId":"lib1","titulo":"Cien años de soledad","cantidad":2,"precioUnitario":1500,"subtotal":3000},{"libroId":"lib2","titulo":"Poemas de la soledad","cantidad":1,"precioUnitario":2000,"subtotal":2000}],"total":5000}]`. El renglón guarda su propia copia de `precioUnitario` y `subtotal`. |

### Caso 6 — Venta confirmada + cambio exclusivo del precio del catálogo guardado

Ejecutado en una **copia de prueba** de la carpeta del proyecto, sobre `file://` y también sobre
HTTP local, con un perfil de navegador propio.

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Confirmar la venta | Caso 5: 2 × $ 1500.00 y 1 × $ 2000.00 | Venta confirmada con total $ 5000.00 | **Coincide.** Venta `venta-1`, total `$ 5000.00`, detalle con `$ 1500.00 / $ 3000.00` y `$ 2000.00 / $ 2000.00`. |
| (b) Editar **solo** el catálogo guardado | En `libreriaAurora:libros`, el precio de "Cien años de soledad" pasó de `1500` a `9999`. **No** se tocó `libreriaAurora:ventas` | El catálogo guardado cambia; las ventas quedan intactas | **Coincide.** Tras la edición: `libreriaAurora:libros` con `"precio":9999` para ese libro y `libreriaAurora:ventas` **byte a byte igual** que antes de la edición (mismo `precioUnitario: 1500`, `subtotal: 3000`, `total: 5000`). |
| (c) Recargar | F5 | El catálogo muestra el precio nuevo y la venta conserva sus importes | **Coincide.** El catálogo muestra "Precio: $ 9999.00" para ese libro; la venta `venta-1` sigue en el historial y su detalle conserva: "Cien años de soledad | 2 | **$ 1500.00** | **$ 3000.00**" y "Poemas de la soledad | 1 | $ 2000.00 | $ 2000.00", con total **$ 5000.00**. El precio guardado del catálogo quedó en `9999` tras la recarga. |

**Por qué funciona:** el renglón guarda su propia copia de `precioUnitario` y `subtotal` en el
momento de confirmar (`js/ventas.js`), y `js/ventas.js` arma el historial **solo** con
`datos.ventas`: nunca vuelve a leer el precio del catálogo.

### Caso 7 — Recarga después de altas y de una venta

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Recargar | Después de registrar un libro, un cliente y una venta | Se recuperan los datos sin duplicar ni los ejemplos ni las ventas | **Coincide.** Tras recargar: catálogo con 7 tarjetas, listado de clientes con 4 filas, historial con 1 venta. En el almacenamiento: `libreriaAurora:libros` con 7 elementos, `libreriaAurora:clientes` con 4, `libreriaAurora:ventas` con 1. No se duplicaron los 6 libros, los 3 clientes ni la venta de ejemplo. |
| (b) Altas posteriores a la restauración | Registrar un libro más y confirmar otra venta | Los ids nuevos son distintos de los restaurados | **Coincide.** Ids de libros: `lib1…lib6`, `lib7_…` (el del caso 2) y `lib8_…` (el nuevo): ninguno repetido. Ids de ventas: `venta-1` (restaurada) y `venta-2` (nueva). |

**Comprobación adicional de la siembra única:** la primera apertura de un perfil limpio dejó
`libreriaAurora:version` = `"1"` y las cuatro claves creadas; las aperturas siguientes no volveron
a sembrar. Cambiando la bandera a `"0"` a propósito, la aplicación **volvió a sembrar desde
cero** (6 libros, 3 clientes, 0 ventas) y actualizó la bandera a `"1"`, tal como está especificado.

### Caso 8 — Navegación por teclado y anchos de 320 px y 1280 px

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Recorrido con Tab | 12 pulsaciones de Tab desde el inicio de la página | Los controles se recorren con el teclado y el foco es visible | **Coincide.** Orden recorrido: enlace "Saltar al contenido" → "Catálogo" → "Libros" → "Clientes" → "Ventas" → "Historial" → campo de búsqueda → botón "Buscar por título" → botón "Limpiar búsqueda" → campo Título del alta de libro → campo ISBN → campo Precio. En todos los elementos el foco tiene indicador visible (`outline: 3px solid rgba(139, 69, 19, 0.4)` en los campos y borde en los botones y enlaces). |
| (b) Ancho 320 px | Ventana de 320 px | Textos y controles legibles, **sin desplazamiento horizontal de la página**; las tablas se desplazan dentro de su propio contenedor | **Coincide (tras una corrección).** En la **primera medición** la página sí se desplazaba en horizontal: el documento medía 640 px de contenido contra 305 px disponibles, porque los hijos de la rejilla no se encogían por debajo del ancho mínimo de la tabla (500 px) y porque los campos en línea de la vista Ventas tomaban el ancho de su contenido. Se corrigió con tres reglas de CSS en `css/estilos.css` (`.rejilla-dos-columnas > * { min-width: 0; }` y, en el bloque de hasta 768 px, `.formulario__acciones--fila > * { width: 100%; min-width: 0; }` y `.campo--en-linea { min-width: 0; }`). **Medición final:** documento de 305 px con 305 px disponibles → sin desplazamiento horizontal de la página; y la tabla de libros sí se desplaza dentro de su propio contenedor (`.tabla-envoltura`: 582 px de contenido en 239 px visibles, `overflow-x: auto`). |
| (c) Ancho 1280 px | Ventana de 1280 px | Mismo criterio | **Coincide.** Documento de 1265 px con 1265 px disponibles (el resto es la barra de desplazamiento): sin desplazamiento horizontal de la página. |

### Comprobaciones adicionales del Ejercicio 6 (no forman parte de la §10)

| Comprobación | Resultado observado |
|---|---|
| Clave con JSON inválido (`libreriaAurora:clientes` = `{esto no es json`) | Al recargar: aviso visible "Aviso: el contenido guardado de clientes no se pudo interpretar. Se cargaron los datos de ejemplo de esas secciones y la aplicación sigue operativa."; el catálogo (7) y las ventas (1) **se conservaron**; los clientes volvieron a la siembra (3) y la clave se reescribió como un arreglo válido. Sin errores en la consola. |
| Clave con la forma incorrecta (`libreriaAurora:ventas` = `{"no":"es un arreglo"}`) | Aviso equivalente, las ventas volvieron a la semilla (`[]`), el catálogo (7) no se tocó. Sin errores en la consola. |
| `localStorage` bloqueado (se simuló un `SecurityError` al leerlo) | Aviso visible: "no hay almacenamiento local disponible porque el navegador bloqueó el almacenamiento local (modo privado o política del protocolo file://). Los datos quedan solo en memoria y se pierden al cerrar la página."; la aplicación siguió funcionando en memoria (6 libros en el catálogo) y sin errores en la consola. |
| Claves ajenas al proyecto | Tras llamar a `escribir()`, una clave externa (`claveAjena`) quedó intacta: el módulo solo toca sus cuatro claves. |
| Literales no persistidos | Las únicas claves del proyecto son `libreriaAurora:version`, `libreriaAurora:libros`, `libreriaAurora:clientes` y `libreriaAurora:ventas`. No hay arreglos de editoriales, géneros ni autores guardados. |
| Recorrido completo de la aplicación | Las cinco vistas, los tres formularios y el historial funcionan sin errores en la consola (0 errores y 0 excepciones) en `file://` y en HTTP local. Ningún dato del usuario se inserta con `innerHTML`: en `js/` no hay ninguna aparición de `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` ni `document.write`; todo el texto se inserta con `textContent`. |

## 9. La persistencia en `localStorage`

### 9.1 Dónde están los datos iniciales

- **Semilla de ejemplo:** `js/datos.js` (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes
  ficticios y 0 ventas). Es la única fuente de los datos de ejemplo.
- **Mecanismo de persistencia:** `js/persistencia.js` (claves, bandera de versión, lectura
  validada, escritura y avisos).
- **Estado en memoria:** `window.LibreriaDatos` (mismo global que usaban los ejercicios 3 a 5).

### 9.2 Nombres exactos de las claves

| Clave | Contenido | Formato |
|---|---|---|
| `libreriaAurora:version` | Bandera de siembra única | Texto plano: `"1"` |
| `libreriaAurora:libros` | Catálogo de libros | Arreglo JSON |
| `libreriaAurora:clientes` | Clientes registrados | Arreglo JSON |
| `libreriaAurora:ventas` | Ventas confirmadas | Arreglo JSON |

**Cada entidad va en su propia clave a propósito:** así el docente puede cambiar **únicamente** el
precio de un libro en `libreriaAurora:libros` sin tocar `libreriaAurora:ventas`, que quedan intactas
por construcción (es el caso 6 de la consigna).

`editoriales`, `generos` y `autores` **no se guardan**: no se administran desde la interfaz (§6.6 de
la consigna) y no cambian entre aperturas, así que viven fijos en `js/datos.js`.

### 9.3 Estructura del JSON guardado

**`libreriaAurora:libros`** (un objeto por libro):

```json
[
  {
    "id": "lib1",
    "titulo": "Cien años de soledad",
    "isbn": "978-950-07-0011-0",
    "precio": 1500,
    "editorialId": "ed1",
    "generoId": "gen1",
    "autorIds": ["aut1"]
  }
]
```

- `precio` es **numérico** (no texto formateado): es el campo que el docente puede modificar.
- `generoId` es `null` cuando el libro no tiene género ("Sin clasificar").
- `editorialId` y `autorIds` apuntan a los literales de `js/datos.js` (`ed1`, `ed2`, `aut1`…).

**`libreriaAurora:clientes`**:

```json
[{ "id": "cli1", "nombre": "Ana Pérez", "email": "ana.perez@ejemplo.com" }]
```

**`libreriaAurora:ventas`** (una venta por objeto, con los importes ya copiados):

```json
[
  {
    "id": "venta-1",
    "fecha": "2026-10-20T11:55:06.644Z",
    "clienteId": "cli1",
    "cliente": { "id": "cli1", "nombre": "Ana Pérez", "email": "ana.perez@ejemplo.com" },
    "renglones": [
      { "libroId": "lib1", "titulo": "Cien años de soledad", "cantidad": 2, "precioUnitario": 1500, "subtotal": 3000 },
      { "libroId": "lib2", "titulo": "Poemas de la soledad", "cantidad": 1, "precioUnitario": 2000, "subtotal": 2000 }
    ],
    "total": 5000
  }
]
```

- `precioUnitario` y `subtotal` son **copias históricas**: el historial no vuelve a leer el precio
  del catálogo.
- `titulo` y `cliente` son copias descriptivas, para que la venta se pueda leer aunque el catálogo
  cambie.

### 9.4 Cómo reproducir el caso 6 (el precio histórico)

1. Confirmá una venta y **anotá** sus importes (por ejemplo: 2 × $ 1500.00 y 1 × $ 2000.00,
   total $ 5000.00).
2. Abrí las herramientas del navegador: **F12 → Application → Local Storage** → elegí el origen
   desde el que abriste el proyecto (`file://` o `http://127.0.0.1:8765`).
3. Editá **solo** la clave `libreriaAurora:libros` y, dentro del arreglo, **solo** el campo
   `"precio"` del libro vendido (por ejemplo, `"precio": 1500` → `"precio": 9999`). **No toques**
   `libreriaAurora:ventas`.
4. Recargá la página (F5).
5. Entrá a **Historial** → **"Ver detalle"** de esa venta: el precio unitario, los subtotales y el
   total **siguen siendo los de la venta confirmada**, mientras que el catálogo muestra el precio
   nuevo.

Atajo por consola (mismo resultado, en la pestaña Console de la página):

```js
const libros = JSON.parse(localStorage.getItem('libreriaAurora:libros'));
libros.find(l => l.titulo === 'Cien años de soledad').precio = 9999;
localStorage.setItem('libreriaAurora:libros', JSON.stringify(libros));
```

Después: recargar y revisar el detalle de la venta.

### 9.5 Cómo funciona la siembra única y qué pasa si los datos se rompen

- Si `libreriaAurora:version` **no existe** o su valor **no es** `"1"`: se cargan los datos de
  ejemplo y se escribe todo (incluida la bandera). Es el mecanismo para invalidar datos viejos si
  cambia el formato de guardado.
- Si la bandera **coincide**: se restaura `libreriaAurora:libros`, `libreriaAurora:clientes` y
  `libreriaAurora:ventas`, **antes** de la primera renderización (por eso `js/persistencia.js` se
  carga antes que `js/datos.js` en `index.html`: no hay parpadeo ni doble render).
- Cada clave se valida por separado: si una está ausente, tiene JSON inválido o no es un arreglo,
  **solo esa entidad** vuelve a la siembra, se muestra un aviso de texto y la aplicación sigue
  operativa; las demás se conservan.

### 9.6 Límites de `localStorage` (importante para la evaluación)

- **Es local.** Los datos quedan en el navegador y en el **perfil de usuario** de esa máquina: no
  se comparten entre equipos, ni entre navegadores, ni entre usuarios del mismo equipo, ni entre
  dispositivos. No hay sincronización ni copia en la nube.
- **Depende de la ubicación de apertura.** `file://` y `http://127.0.0.1` son orígenes distintos:
  cada uno tiene su propio almacenamiento. Los datos guardados abriendo `index.html` con doble
  clic **no** aparecen si después se sirve la carpeta por HTTP (ni al revés).
- **Depende del navegador.** Si se borran los datos de navegación, o se usa el modo incógnito, o se
  desinstala el navegador, los datos se pierden. En el modo incógnito el almacenamiento suele ser
  efímero y, en ciertas configuraciones, está bloqueado.
- **Se puede editar a mano.** Es justamente lo que pide el caso 6, pero también significa que
  **no es un mecanismo de seguridad**: cualquiera con acceso al navegador puede alterar los datos.
  Los datos de la práctica son ficticios y no hay integridad garantizada por un servidor.
- **Sin fallback silencioso.** Si el navegador lo bloquea, la aplicación **avisa por texto** y sigue
  funcionando en memoria (los datos de esa sesión se pierden al cerrar la pestaña).
