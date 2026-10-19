# Librería Aurora — Frontend de una librería (HTML, CSS y JavaScript nativos)

TPI de Programación III — Frontend de una librería.
Consigna oficial: `docs/Repaso Primer Parcial.pdf`.

---

## 1. Quiénes realizan el trabajo

> - (Integrante 1 — Nombre y apellido — Legajo)
> - (Integrante 2 — Nombre y apellido — Legajo)

*(Completar antes de la entrega.)*

## 2. Cómo abrir el proyecto

1. Abrí la carpeta del proyecto en el explorador de archivos.
2. Hacé **doble clic en `index.html`**.
3. Listo: se abre en el navegador.

No hace falta instalar nada. No hay `package.json`, ni `node_modules`, ni servidor, ni conexión a
internet: el proyecto se abre directamente con el protocolo `file://` y **no realiza ninguna petición
de red**.

## 3. Qué contiene esta entrega

La entrega separa estructura, estilos y comportamiento en archivos propios:

- `index.html` — punto de entrada obligatorio con las **cinco vistas** del Ejercicio 1: Catálogo,
  Libros, Clientes, Ventas e Historial; navegación por anclas y un enlace de salto al contenido.
- `css/estilos.css` — identidad visual propia (colores, tipografía, tarjetas, formularios y botones)
  y layout con Flexbox/Grid, sin librerías ni CDN.
- `js/datos.js` — modelo de datos local: arrays con identificadores estables (`libros`,
  `editoriales`, `generos`, `autores`, `clientes`) y la siembra mínima (6 libros, 2 editoriales,
  2 géneros, 3 autores y 3 clientes ficticios).
- `js/catalogo.js` — renderizado del catálogo desde el array de libros y filtro por título
  (trim, sin distinguir mayúsculas, coincidencias parciales).
- `js/altas.js` — altas de libros y clientes con `preventDefault`, validaciones y actualización en
  vivo de listados y selectores relacionados.

`index.html` incluye:

- HTML semántico: `<header>`, `<nav>`, `<main>`, cinco `<section>` y `<footer>`.
- Todos los formularios con sus campos, cada uno con su `<label for>` asociado, y botones con texto
  que describe la acción.
- Las cinco tablas con `<caption>` y `<thead>` completo; los cuerpos de tabla de los listados se
  renderizan con JavaScript.
- Los contenedores de mensaje para los estados que la consigna exige comunicar: lista vacía,
  búsqueda sin resultados y operación correcta o rechazada.
- Comentarios `<!-- ENGANCHE ETAPA 2: … -->` que señalan en el código dónde se enganchará el
  comportamiento que sigue pendiente, y un bloque `<noscript>` con el aviso para quien abra el
  proyecto sin JavaScript.

## 4. Qué pantallas son estructura y qué interacciones funcionan

Según `AGENTS.md` §9.2.9 y §9.3, se declara expresamente el estado real de la entrega:

| Elemento | Estado |
|---|---|
| Las 5 pantallas (Catálogo, Libros, Clientes, Ventas, Historial) | Estructura semántica lista. |
| Navegación por anclas y enlace de salto | **Funciona** (HTML puro). |
| Catálogo y filtro por título | **Funciona** (renderizado dinámico y actualización al agregar libros). |
| Formularios de alta de libros y clientes (Ejercicio 4) | **Funciona**: validación completa, prevención de duplicados (ISBN y email), selectores dinámicos, mensajes de éxito/error y actualización en vivo de listados y selectores sin recargar la página. |
| Composición y confirmación de la venta | Pendiente (Ejercicio 5). |
| Historial de ventas y detalle | Pendiente (Ejercicio 5). |
| Persistencia de datos en `localStorage` | Pendiente (Ejercicio 6). |

**Casos manuales de la §10:** los casos 2 y 3 se ejecutaron y sus resultados observados figuran en
la §8. Los casos restantes no se registraron en esta actualización (los casos 4, 5, 6 y 7 dependen
además de los Ejercicios 5 y 6). Según `AGENTS.md` §9.3, ninguna prueba se da por aprobada sin
haberse ejecutado y registrado.

## 5. Lo que todavía no funciona (pendientes)

- **Venta simulada** (Ejercicio 5): selección de cliente, renglones sin libros repetidos dentro de
  la misma venta, cálculos de subtotal y total con dos decimales y confirmación que copia el precio
  unitario al renglón.
- **Historial** (Ejercicio 5): listado de ventas, detalle de renglones e inmutabilidad del precio
  histórico frente a cambios posteriores del catálogo.
- **Persistencia** (Ejercicio 6): guardar libros, clientes y ventas en `localStorage`, con clave de
  versión para no duplicar los datos sembrados al reabrir.
- **Casos manuales de la §10 aún no registrados**: 1, 4, 5, 6, 7 y 8 (ver §8).

## 6. Alcance técnico

HTML, CSS y JavaScript nativos únicamente: no se usan librerías, frameworks, CDN, herramientas de
compilación, backend ni llamadas `fetch`. Todo el comportamiento corre en el navegador sobre datos
locales en memoria (`localStorage` todavía no se usa: es pendiente del Ejercicio 6).

## 7. Estructura del proyecto

```
index.html            ← punto de entrada
css/estilos.css       ← estilos propios (sin librerías ni CDN)
js/datos.js           ← datos locales y siembra inicial
js/catalogo.js        ← renderizado y filtro del catálogo
js/altas.js           ← altas de libros y clientes con validaciones
README.md             ← este archivo
AGENTS.md             ← reglas del proyecto
docs/                 ← consigna oficial en PDF
openspec/             ← especificación de los cambios
```

No hay imágenes propias ni de terceros, así que no hay procedencia que acreditar.

## 8. Casos manuales ejecutados (§10 de la consigna)

Ejecutados el 19/10/2026 sobre el archivo local `index.html` en un navegador real (Chrome 155,
sin interfaz gráfica, controlado por el protocolo de DevTools): se cargó la página, se completaron
los campos de cada formulario y se disparó el envío real del formulario. Se anota lo observado en
cada paso, coincidente o no con lo esperado (`AGENTS.md` §9.3).

### Caso 2 — ISBN existente y luego ISBN nuevo

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Libro con ISBN existente | Título "Libro de prueba duplicado"; ISBN `978-950-07-0011-0` (perteneciente a "Cien años de soledad"); precio 1000; editorial Sudamericana; sin género; un autor | Se rechaza el duplicado | **Rechazado.** Mensaje: "Operación rechazada: El ISBN ingresado ya existe en el sistema." El listado siguió con 6 filas: no se agregó el registro. |
| (b) Libro con ISBN nuevo | Título "Libro de prueba nuevo"; ISBN `999-000-0001-1`; precio 1234,56; editorial Planeta; género Novela; dos autores | Aceptado; aparece en catálogo y en listado | **Aceptado.** Mensaje: "Operación correcta: el libro "Libro de prueba nuevo" se registró exitosamente." El listado pasó a 7 filas y el catálogo a 7 tarjetas, ambos con los datos cargados (editorial, género, autores y precio $ 1234.56). |

**Desviación observada respecto de lo previsto:** se esperaba que "el selector de la vista Ventas
permanezca vacío". No es así: `js/altas.js` puebla los selectores de Ventas con los datos sembrados
al iniciar (7 libros y 3 clientes, más el placeholder) y los actualiza con cada alta (pasó a 8
opciones de libro después del alta válida). Es el comportamiento exigido por `AGENTS.md` §7.3
("el listado y las opciones relacionadas se actualizan sin recargar la página"): la expectativa de
la tarea estaba desactualizada, no es un defecto del código.

### Caso 3 — Email inválido, email existente en mayúsculas y email nuevo

| Paso | Entrada | Resultado esperado | Resultado observado |
|---|---|---|---|
| (a) Email inválido | Nombre "Cliente de prueba"; email `no-es-un-email` | Se rechaza | **Rechazado.** Mensaje: "Operación rechazada: El correo electrónico no tiene un formato válido." El listado siguió con 3 filas. |
| (b) Email ya registrado, en mayúsculas | Nombre "Cliente de prueba"; email `ANA.PEREZ@EJEMPLO.COM` (registrado en minúsculas como ana.perez@ejemplo.com) | Se rechaza | **Rechazado.** Mensaje: "Operación rechazada: Ya existe un cliente registrado con ese correo electrónico." El listado siguió con 3 filas: la comparación se hizo con `trim()` y sin distinguir mayúsculas/minúsculas, así que detectó la duplicación pese a que el texto ingresado estaba en mayúsculas. |
| (c) Email nuevo | Nombre "Cliente de prueba"; email `cliente.nuevo@ejemplo.com` | Aceptado; aparece en el listado | **Aceptado.** Mensaje: "Operación correcta: el cliente "Cliente de prueba" se registró exitosamente." El listado pasó a 4 filas con el nuevo cliente. |

**Desviación observada (misma que el caso 2):** el selector de clientes de la vista Ventas no está
vacío: pasó de 4 a 5 opciones y contiene al cliente recién registrado.

**Notas:**

- Los registros creados viven solo en memoria: al recargar la página vuelven los datos sembrados,
  porque `localStorage` es pendiente del Ejercicio 6.
- Los casos 1, 4, 5, 6, 7 y 8 **no se registran en esta actualización**; los casos 4, 5, 6 y 7
  dependen además de los Ejercicios 5 y 6. Ninguno se da por aprobado (`AGENTS.md` §9.3).