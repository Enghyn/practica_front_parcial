# Tasks

## 1. Módulo de persistencia

- [x] 1.1 Crear `js/persistencia.js` con IIFE y `'use strict'` que exponga `window.LibreriaPersistencia` con las constantes de claves (`libreriaAurora:version`, `libreriaAurora:libros`, `libreriaAurora:clientes`, `libreriaAurora:ventas`), la versión de almacenamiento `"1"` y las funciones `leer()` y `escribir()`; verificar en la consola que `window.LibreriaPersistencia` existe y que no aparecen errores de sintaxis.
- [x] 1.2 Implementar `leer()` con `try/catch` por clave: devolver el arreglo guardado solo si el JSON se puede interpretar y es un arreglo; ante cualquier error devolver `null` para esa clave; verificar con una clave escrita a mano con JSON inválido que la función no lanza y devuelve `null`.
- [x] 1.3 Implementar `escribir()` que serializa `window.LibreriaDatos.libros`, `.clientes` y `.ventas` en las tres claves y deja intactas las claves ajenas al proyecto; verificar en DevTools → Application → Local Storage que las claves quedan con el JSON esperado tras una llamada manual.

## 2. Siembra única y restauración

- [x] 2.1 En `js/datos.js`, mantener la siembra actual (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes, 0 ventas) como valores iniciales y aplicar la regla de la bandera: si `libreriaAurora:version` no existe o su valor no es `"1"`, sembrar y escribir; si coincide, restaurar `libros`, `clientes` y `ventas` guardados; verificar con la consola que tras una primera apertura `libreriaAurora:version` vale `"1"`.
- [x] 2.2 Verificar la restauración antes de la primera renderización: recargar la página y comprobar que el catálogo, el listado de clientes y el historial muestran los registros guardados y no la siembra, sin parpadeo visible ni doble render (agregar un libro, recargar y verificar que sigue estando una sola vez).
- [x] 2.3 Verificar el fallback: borrar o corromper una clave con DevTools (JSON inválido o un objeto en lugar de un arreglo), recargar y comprobar que la aplicación carga los datos de ejemplo de esa entidad, muestra un aviso de texto y sigue operativa; verificar que las otras entidades conservan sus datos.
- [x] 2.4 Verificar que `editoriales`, `generos` y `autores` no se guardan: revisar el contenido de `localStorage` y comprobar que solo existen las claves de versión, libros, clientes y ventas.

## 3. Persistencia en las mutaciones

- [x] 3.1 En `js/altas.js`, llamar a `LibreriaPersistencia.escribir()` después de `datos.libros.push(...)` y después de `datos.clientes.push(...)`; verificar que un libro y un cliente nuevos aparecen en sus claves de `localStorage` y que los listados en pantalla no cambian de comportamiento.
- [x] 3.2 En `js/ventas.js`, llamar a `LibreriaPersistencia.escribir()` después de `datos.ventas.push(venta)`; verificar que la venta guardada incluye en cada renglón `precioUnitario` y `subtotal` copiados, y que el historial sigue sin releer el precio del catálogo.
- [x] 3.3 Verificar que los ids no se repiten tras restaurar: registrar un libro, una venta, recargar y comprobar que los ids nuevos son distintos de los restaurados (caso 7 de la §10).

## 4. Textos de estado del documento

- [x] 4.1 Agregar `<script src="js/persistencia.js"></script>` antes de `js/datos.js` en `index.html` y verificar que la aplicación sigue cargando sin errores en la consola.
- [x] 4.2 Actualizar el aviso de estado, el bloque `<noscript>` y el pie de página de `index.html` para que informen que la persistencia con `localStorage` ya funciona y no nombren ninguna operación del alcance del TPI como pendiente; verificar el texto renderizado en el navegador.

## 5. Verificación manual de los casos de la consigna

- [x] 5.1 Ejecutar el caso 1 (búsqueda con parte del título en mayúsculas, búsqueda vacía y texto inexistente) en el navegador y anotar en el README el resultado observado de cada paso.
- [x] 5.2 Ejecutar el caso 6 en una copia de prueba del proyecto: confirmar una venta, anotar sus importes, editar en DevTools únicamente el precio del libro en `libreriaAurora:libros` sin tocar `libreriaAurora:ventas`, recargar y comprobar que el detalle conserva el precio unitario, el subtotal y el total; registrar en el README el resultado real.
- [x] 5.3 Ejecutar el caso 7 (recarga después de altas y de una venta) y registrar en el README que los datos se recuperan sin duplicar ejemplos ni ventas.
- [x] 5.4 Ejecutar el caso 8 (navegación por teclado y anchos de 320 px y 1280 px) y registrar en el README el resultado observado del foco visible, de la usabilidad de los controles y del desplazamiento propio de las tablas.
- [x] 5.5 Revalidar los casos 2, 3, 4 y 5 con la persistencia activa (alta con ISBN duplicado y nuevo, alta de cliente con email inválido, duplicado en mayúsculas y nuevo, venta sin cliente y con cantidades inválidas, venta válida de 2 × 1500 y 1 × 2000) y actualizar en el README las filas correspondientes con el resultado observado.

## 6. Documentación de cierre

- [x] 6.1 Actualizar el README §4 para que la fila de `localStorage` pase de "Pendiente (Ejercicio 6)" a funcionando, y ajustar §5 (pendientes) y §6 (alcance técnico, que ya no dice que los datos viven solo en memoria); verificar que ninguna sección afirma que la persistencia está pendiente.
- [x] 6.2 Agregar al README la sección con el **nombre exacto de las claves** de `localStorage`, la estructura del JSON guardado en cada una (campos de libro, cliente y venta) y los pasos numerados para alterar únicamente el precio de un libro en `libreriaAurora:libros` y comprobar la venta; verificar que los pasos se pueden seguir solo con el README.
- [x] 6.3 Completar en el README las secciones obligatorias que faltan: integrantes del trabajo (completados con los nombres y legajos del equipo), navegación entre vistas, funcionalidades implementadas y pendientes, ubicación de los datos iniciales (`js/datos.js`), funcionamiento y límites de `localStorage` (depende del navegador, del perfil y de la ubicación de apertura; no comparte datos entre usuarios) y procedencia de imágenes (no hay imágenes propias ni de terceros).
- [x] 6.4 Registrar en el README §8 el resultado observado de los 8 casos de la §10, con fecha y navegador usado, diferenciando "resultado esperado" de "resultado observado"; si algún caso no pudo ejecutarse, dejarlo marcado como pendiente con su resultado real y no como aprobado.
- [x] 6.5 Actualizar `AGENTS.md` §14 para que refleje el estado real del repositorio (existencia de `css/`, `js/`, `README.md` y de la persistencia implementada) y verificar que no quedan pendientes anunciados que ya estén resueltos.

## 7. Verificación de cierre

- [x] 7.1 Revisar que el proyecto no incorpora librerías, CDNs, `package.json`, `node_modules`, runners ni scripts de prueba: verificar que el árbol de archivos entregado solo contiene HTML, CSS, JS y documentación.
- [x] 7.2 Recorrer la aplicación completa en el navegador con la persistencia activa y verificar que las cinco vistas, los tres formularios y el historial siguen funcionando sin errores en la consola, y que ningún dato de usuario se inserta con `innerHTML`.
- [x] 7.3 Archivar el cambio con `openspec archive` cuando la revisión del proyecto lo apruebe.
