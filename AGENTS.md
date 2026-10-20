# AGENTS.md — TPI: Frontend de una Librería

> Canonical project instructions. Derived from `docs/Repaso Primer Parcial.pdf`.
> Materia: Programación III — Unidad HTML, CSS y JavaScript. Revisor: Prof. Matías Torres.

---

## 1. Objetivo del proyecto

Construir el **frontend de un sistema de librería** usando **exclusivamente HTML, CSS y JavaScript nativos**. El sistema presenta su catálogo y registra libros, clientes y ventas. Todos los datos y operaciones se **simulan en el navegador**.

Los objetivos formativos son:

1. Construir interfaces con **HTML semántico** y **CSS propio**.
2. Relacionar **formularios, listados y navegación** con las entidades del proyecto.
3. Aplicar **JavaScript nativo** para representar datos locales, modificar el DOM y responder a eventos.
4. **Validar entradas** y comprobar el comportamiento mediante **casos manuales reproducibles**.

---

## 2. Alcance técnico — reglas duras (NO negociables)

Estas reglas **incumplidas invalidan el alcance técnico** y se informan en la evaluación.

| Regla | Detalle |
|---|---|
| 🚫 **Sin librerías** | No usar ninguna librería de JavaScript o CSS. |
| 🚫 **Sin frameworks** | Nada de React, Vue, Angular, Svelte, etc. |
| 🚫 **Sin CDNs** | No descargar CSS/JS de fuentes externas en el HTML. |
| 🚫 **Sin build tools** | Nada de npm, Vite, Webpack, bundlers ni node_modules. |
| 🚫 **Sin backend** | No hay API, servidor, base de datos ni `fetch`. |
| 🚫 **Sin login real** | No se requiere ni se implementa inicio de sesión. |
| ✅ **Recursos locales** | Estilos, scripts e imágenes se incluyen **dentro** del proyecto. |
| ✅ **Solo vanilla** | HTML, CSS y JavaScript nativos. |

> **Nota de seguridad:** los datos son ficticios. `localStorage` y las validaciones sirven para la práctica; **no representan seguridad ni integridad garantizada por un servidor**. La venta registra cantidades y precios para obtener un total simulado, **sin gestionar stock, cobros ni facturación fiscal**.

---

## 3. Entregables

```
index.html            ← punto de entrada obligatorio
otros .html           ← opcionales (varias páginas o secciones)
css/                  ← estilos en archivos externos
js/                   ← scripts
assets/img/           ← imágenes locales
README.md             ← obligatorio
```

- `index.html` es la **entrada única**.
- **No se incluyen dependencias instaladas ni herramientas de compilación.**
- Se entrega carpeta o archivo comprimido.

---

## 4. Vistas requeridas (Ejercicio 1 — 20 pts)

Debe existir **navegación clara** entre estas 5 vistas:

### 4.1 Catálogo
- Título de la librería.
- **Buscador por título.**
- Listado de libros. Cada libro muestra: **título, ISBN, editorial, género, autores y precio**.
- Si el libro **no tiene género asignado**, se muestra literalmente **`Sin clasificar`**.

### 4.2 Libros
- Formulario de alta + listado de libros registrados.

### 4.3 Clientes
- Formulario de alta + listado de clientes registrados.

### 4.4 Ventas
- Selección de cliente, composición de renglones y resumen de la venta.

### 4.5 Historial
- Listado de ventas + acceso a sus detalles.

### 4.6 Requisitos de estructura y accesibilidad (HTML)

- Usar **etiquetas semánticas**: `<header>`, `<nav>`, `<main>`.
- **Cada campo tiene una etiqueta `<label>` asociada** (`for` / `id`).
- Los **botones tienen textos que describen su acción** (ej. "Agregar libro", no "OK").
- Las **tablas incluyen encabezados** `<thead>` / `<th>`.
- Incluir **mensajes para**:
  - listas vacías,
  - búsquedas sin resultados,
  - operaciones correctas **o rechazadas**.
- La estructura **contempla los campos y estados** que luego usa JavaScript.
- *En etapa 1 los listados pueden usar datos estáticos de ejemplo.*

---

## 5. Ejercicio 2 — CSS y adaptabilidad (20 pts)

### Identidad visual
- Definir una **identidad visual propia y coherente**: colores, tipografía, espaciado, tarjetas, formularios y botones.
- El CSS vive en **archivos externos**.
- **Reutilizar clases** para elementos equivalentes.

### Layout
- Usar **Flexbox o Grid** para organizar el contenido.

### Pruebas de ancho obligatorias
Comprobar la interfaz en:
- **320 px** → textos y controles legibles, **sin desplazamiento horizontal de la página completa**.
- **1280 px** → mismo criterio.
- Si una tabla necesita más espacio: **se desplaza dentro de su propio contenedor** (no la página).

### Accesibilidad
- Los controles **conservan foco visible** y **se recorren con el teclado**.
- Los **errores se expresan con texto**; no dependen **únicamente** del color.
- Las **imágenes informativas tienen texto alternativo** (`alt`); las **decorativas** (`alt=""`) no repiten información innecesaria.

---

## 6. Ejercicio 3 — Datos locales, catálogo y filtro (15 pts)

### 6.1 Modelo de datos
Representar mediante **arrays y objetos con identificadores estables**:

- `libros`, `editoriales`, `generos`, `autores`, `clientes`

### 6.2 Sembrado mínimo obligatorio

| Entidad | Mínimo |
|---|---|
| Libros | **6** |
| Editoriales | **2** |
| Géneros | **2** |
| Autores | **3** |
| Clientes | **3** (ficticios) |

**Reglas de relación:**
- Cada libro se relaciona con **una editorial existente**.
- Cada libro tiene **uno o más autores existentes**.
- El **género es opcional**; si se asigna, debe ser **un género existente**.

### 6.3 Renderizado
- JavaScript **genera el catálogo a partir del array de libros** (no HTML hardcodeado).

### 6.4 Filtro por título
- **Ignora mayúsculas/minúsculas**.
- Busca **coincidencias parciales** (substring).
- **Elimina espacios sobrantes en los extremos** (`trim`).
- Búsqueda **vacía → muestra todo** el catálogo.
- Búsqueda **sin coincidencias → mensaje claro**.

### 6.5 Calidad
- **Eventos y funciones con responsabilidades reconocibles.**
- Los datos escritos por usuarios se insertan **como texto** en el DOM (`textContent`, **nunca** `innerHTML` con datos de usuario → evita XSS).

### 6.6 Fuera de alcance
- **No** se requiere traer datos con `fetch`.
- **No** se administran altas, bajas ni modificaciones de **editoriales, géneros o autores**.

---

## 7. Ejercicio 4 — Alta de libros y clientes (15 pts)

### 7.1 Formulario de libros

**Campos:** título, ISBN, precio, editorial, género, autores.

**Los selectores se generan desde los datos locales:**
- Editorial → `<select>`
- Género → `<select>` — **incluye la opción `Sin clasificar`** (representa la ausencia de género).
- Autores → **selector múltiple** (`<select multiple>`) o controles equivalentes.

**Validaciones obligatorias:**
1. Título **no vacío**.
2. ISBN **no vacío**.
3. ISBN **no duplicado** en el conjunto local.
4. Precio **numérico y mayor que cero**.
5. Editorial **existe** en los datos locales.
6. **Al menos un autor** seleccionado, y **todos** los seleccionados **existen**.
7. Género **puede quedar sin asignar**; si se asigna, debe **existir**.

> **ISBN:** para este TPI se compara **sin espacios ni guiones**. **No** se requiere implementar el dígito de control.

### 7.2 Formulario de clientes

**Campos:** nombre completo y email. (No se requiere un campo de apellido separado.)

**Validaciones obligatorias:**
1. Nombre completo **no vacío**.
2. Email **no vacío**.
3. Email con **formato válido**.
4. Email **no duplicado**, comparado **sin espacios exteriores** (`trim`) y **sin distinguir mayúsculas/minúsculas**.

### 7.3 Comportamiento del alta

- Controlar el envío con **`preventDefault`**.
- Mostrar **errores cerca del formulario** (junto al campo, no un aviso genérico al final).
- **Solo agregar el registro si todas las comprobaciones pasan.**
- Tras un alta correcta: el **listado y las opciones relacionadas se actualizan sin recargar la página**.
- **No se exige editar ni eliminar registros.**

---

## 8. Ejercicio 5 — Venta simulada e historial (20 pts)

### 8.1 Composición de la venta

- Se selecciona un **cliente existente**.
- Se agregan **al menos un renglón** con un **libro existente** y **cantidad entera mayor que cero**.
- 🚫 **No se admiten libros repetidos dentro de la misma venta**: o se **modifica la cantidad** del renglón existente, o se **informa el duplicado**.
- Antes de confirmar se permite **cambiar cantidades** y **quitar renglones**.

### 8.2 Cálculos

- Cada renglón muestra: **libro, cantidad, precio unitario y subtotal**.
- `subtotal = cantidad × precio`
- `total = Σ subtotales`
- **Todos los importes se presentan con dos decimales.**

### 8.3 Validaciones al confirmar

No se permite confirmar una venta:
- **sin cliente**,
- **sin renglones**,
- **con cantidades inválidas**.

### 8.4 Inmutabilidad del historial — regla crítica ⛔

Al confirmar se registra: **identificador, fecha, cliente, renglones y total**.

> **El precio unitario se COPIA al renglón como valor histórico.**
> Al consultar el historial **NO** se vuelve a obtener desde el precio actual del catálogo.
> También se conservan los **datos descriptivos** necesarios para leer esa venta (ej. título del libro).

Esta es la regla más evaluada del TPI. Implementarla **declarando la copia**, no releyendo el catálogo.

### 8.5 Comportamiento

- El historial muestra **identificador, fecha, cliente y total**, y permite **consultar los renglones**.
- 🚫 Las ventas confirmadas **no se editan ni eliminan** desde la interfaz.
- La confirmación **limpia el formulario** para una nueva venta y **muestra un mensaje de resultado**.

---

## 9. Ejercicio 6 — Persistencia, verificación y documentación (10 pts)

### 9.1 Persistencia

- Usar **`localStorage`** para conservar **libros, clientes y ventas**.
- **Primer inicio:** se cargan los ejemplos.
- **Al volver a abrir:** se recuperan los registros guardados **sin duplicar los datos iniciales**.
  → Usar una **clave de versión / bandera** (`storageVersion` o similar) para sembrar una sola vez.

### 9.2 README — contenido obligatorio

El README debe:

1. **Identificar a quienes realizan el trabajo.**
2. Explicar **cómo abrir `index.html` en el navegador sin npm**.
3. Describir la **navegación entre vistas**.
4. Listar **funcionalidades implementadas y pendientes**.
5. Indicar la **ubicación de los datos iniciales**.
6. Explicar el **funcionamiento y límites de `localStorage`**: depende del navegador, del perfil y de la ubicación de apertura; **no comparte información entre usuarios**.
7. Registrar los **resultados de los casos manuales** (ver §10).
8. Indicar la **procedencia de imágenes ajenas**, si existen.
9. **En un avance de etapa 1:** identificar expresamente qué pantallas son **maquetas** y qué interacciones **ya funcionan**.
10. La ubicación y estructura del **catálogo guardado** deben identificarse para reproducir la comprobación del precio histórico.

### 9.3 Honestidad de verificación

> Si un caso falla o una funcionalidad queda pendiente, **se registra el comportamiento real**.
> **No se indica una prueba como aprobada sin ejecutarla.**

---

## 10. Casos manuales reproducibles

Los 8 casos del PDF. Cada uno debe estar **ejecutado** y su resultado **registrado en el README**.

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | Búsqueda con parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados. |
| 2 | Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta. |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección. |
| 4 | Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón. |
| 5 | Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial. |
| 6 | Venta confirmada + cambio **exclusivo** del precio de catálogo guardado en `localStorage` (en copia de prueba) | Tras recargar, el **precio unitario, subtotales y total** de esa venta **conservan** los valores confirmados. |
| 7 | Recarga después de altas y venta | Se recuperan datos **sin duplicar ejemplos ni ventas**. |
| 8 | Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita. |

### Cómo reproducir el caso 6 (precio histórico)

1. Confirmar una venta y **anotar sus importes**.
2. Con las **herramientas de almacenamiento del navegador** (DevTools → Application → Local Storage), modificar **únicamente el precio del libro** dentro del catálogo guardado, **sin modificar ni borrar las ventas guardadas**.
3. **Recargar** la página.
4. Consultar el **detalle de la venta anterior**.

> **No se exige una pantalla para editar precios.**

---

## 11. Criterios de evaluación (100 pts)

| Ejercicio | Puntos | Desglose |
|---|---|---|
| **1. HTML** | **20** | Vistas y navegación: 10 · Semántica, formularios y estados: 10 |
| **2. CSS** | **20** | Coherencia y organización: 8 · Adaptación: 8 · Accesibilidad básica: 4 |
| **3. Datos y catálogo** | **15** | Modelo y ejemplos: 5 · Renderizado: 5 · Filtro y estados: 5 |
| **4. Altas** | **15** | Libros y selectores: 6 · Clientes: 4 · Validación y actualización: 5 |
| **5. Ventas** | **20** | Composición y validaciones: 8 · Cálculos: 5 · Confirmación e historial inmutable: 7 |
| **6. Cierre** | **10** | Persistencia: 4 · Pruebas manuales registradas: 3 · Documentación y entrega: 3 |

**Criterios transversales de calidad:**
- La **maqueta debe facilitar el uso** de las operaciones.
- El **diseño no reemplaza las validaciones**.
- Se valora **código legible**, **nombres comprensibles**, **funciones acotadas** y **separación entre estructura, estilos y comportamiento**.

> El uso de librerías o frameworks incumple el alcance técnico. La consigna **no fija penalizaciones adicionales** ni un mínimo de aprobación.

---

## 12. Organización del trabajo en dos etapas

### Etapa 1 — Maquetación (durante la semana de repaso)
Prioridad: pantallas del ejercicio 1 + presentación del ejercicio 2:
**navegación, catálogo, alta y listado de libros, alta y listado de clientes, formulario de venta e historial.**

- Se usan **ejemplos estáticos** para definir el aspecto.
- Se incorpora **una interacción básica**: filtro por título o validación de formulario.
- Los **controles pendientes se identifican como parte de la maqueta**; **no se presentan como operaciones completas**.
- El avance identifica qué pantallas son maquetas y qué interacciones ya funcionan.

### Etapa 2 — TPI completo
- Se **conectan las pantallas con datos locales**.
- Se completan los **ejercicios 3 a 6**, incluidas validaciones, ventas y persistencia.
- La entrega final reúne el **alcance completo**.

> El docente comunica por separado las **fechas**, el **canal de entrega** y la **modalidad de trabajo**.

---

## 13. Convenciones para agentes que trabajen en este proyecto

1. **Nunca** Introducir `<script src="https://...">`, `<link href="https://cdn...">`, `import` de npm, o `package.json`.
2. **Siempre** usar **`textContent`** para datos ingresados por el usuario; nunca construir HTML con concatenación de datos.
3. **Siempre** comparar ISBN sin espacios ni guiones (`replace(/[\s-]/g, '')`) y emails con `trim()` + `toLowerCase()`.
4. **Siempre** copiar el precio unitario al renglón en el momento de la confirmación.
5. **Nunca** leer el precio del catálogo al renderizar el historial de una venta existente.
6. **Siempre** ejecutar los casos manuales de §10 y registrar el resultado **real** en el README antes de marcarlos como aprobados.
7. Mantener **separación estricta**: `.html` = estructura, `css/` = estilos, `js/` = comportamiento.
8. Comentar el código en **español**, de forma breve y solo donde la regla no sea obvia.
9. Si una funcionalidad queda **pendiente**, marcarla explícitamente como pendiente — nunca simular que está completa.
10. **Nunca** guardar libros, clientes y ventas en una **única clave** de `localStorage`: van en claves separadas (`libreriaAurora:libros`, `libreriaAurora:clientes`, `libreriaAurora:ventas`) más la bandera `libreriaAurora:version`, para que el caso 6 permita alterar solo el catálogo guardado sin tocar las ventas.
11. **Siempre** pasar por `window.LibreriaPersistencia.escribir()` tras cada mutación (alta de libro, alta de cliente, venta confirmada) y **nunca** leer el precio del catálogo al mostrar el historial.

---

## 14. Estado actual del repositorio

- `index.html` — punto de entrada válido: las **cinco vistas** del Ejercicio 1 en una sola página,
  con navegación por anclas, `<noscript>`, aviso de estado, aviso de persistencia y pie de página.
  Los `<script>` se cargan al final del `<body>` en este orden: `js/persistencia.js`,
  `js/datos.js`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js` (la persistencia va **primero**
  para que los datos guardados estén restaurados antes del primer render).
- `css/estilos.css` — identidad visual y layout propios (Flexbox/Grid), sin librerías ni CDN.
- `js/datos.js` — modelo de datos local, semilla de ejemplo (6 libros, 2 editoriales, 2 géneros,
  3 autores, 3 clientes) y lógica de siembra única / restauración.
- `js/persistencia.js` — **Ejercicio 6 implementado**: claves `libreriaAurora:version`,
  `libreriaAurora:libros`, `libreriaAurora:clientes`, `libreriaAurora:ventas`; bandera de
  versión `"1"`; lectura validada por clave; escritura tras cada alta y cada venta; aviso por
  texto si el almacenamiento está bloqueado o si un dato guardado no se puede interpretar.
- `js/catalogo.js`, `js/altas.js`, `js/ventas.js` — ejercicios 3, 4 y 5 operativos.
- `README.md` — documentación de cierre: estado real, funcionalidades y pendientes, ubicación de
  los datos iniciales, claves y estructura del `localStorage`, límites del almacenamiento y los
  **8 casos manuales de la §10 ejecutados** con su resultado observado.
- `docs/Repaso Primer Parcial.pdf` — consigna oficial (7 páginas).
- `AGENTS.md` — este archivo.
- `openspec/` — especificación de los cambios (propuesta, diseño, tareas y deltas de spec).
- **Pendiente:** ninguno dentro del alcance del TPI. El archivado del change de OpenSpec del
  Ejercicio 6 queda como último paso administrativo.

