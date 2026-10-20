# Design

## Context

Hoy `js/datos.js` define en memoria los arrays `editoriales`, `generos`, `autores`, `clientes`, `libros` y `ventas` y los expone en `window.LibreriaDatos`; su encabezado aclara que no usa `localStorage` porque eso es del Ejercicio 6. `js/catalogo.js`, `js/altas.js` y `js/ventas.js` leen ese único global y se inicializan al cargar la página, en ese orden (`<script>` al final del `body`). No hay build tools, ni `package.json`, ni `node_modules`: todo es HTML/CSS/JS nativo abierto con `file://`.

ElEjercicio 6 de la consigna (§9) pide persistir `libros`, `clientes` y `ventas` en `localStorage`, sembrar los ejemplos una sola vez y registrar en el README los resultados observados de los 8 casos manuales de la §10, incluidos el caso 6 (precio histórico) y el 7 (recarga sin duplicados), que hoy no se pueden ejecutar.

Dos restricciones condicionan el diseño:

1. **El orden de carga importa**: los datos guardados tienen que estar restaurados *antes* de que `catalogo.js`, `altas.js` y `ventas.js` rendericen, o la primera pantalla mostraría la siembra y luego los datos guardados.
2. **La comprobación del caso 6 es guiada por el docente** sobre el contenido guardado: la estructura guardada tiene que ser fácil de localizar y de editar desde DevTools → Application → Local Storage.

## Goals / Non-Goals

**Goals:**

- Restaurar `libros`, `clientes` y `ventas` desde `localStorage` antes de la primera renderización.
- Escribir el estado guardado después de cada mutación (alta de libro, alta de cliente, confirmación de venta).
- Sembrar los datos de ejemplo una sola vez, mediante una bandera de versión, y re-sembrar si la versión no coincide o el contenido está corrupto.
- Dejar el contenido guardado en una estructura simple y documentada, editable a mano para el caso 6.
- Registrar en el README los 8 casos manuales con su resultado real y el estado real de la entrega.

**Non-Goals:**

- Persistir `editoriales`, `géneros` ni `autores` (ver decisión 3).
- Editar o eliminar ventas guardadas: siguen siendo inmutables (`venta-simulada`).
- Cualquier forma de login, sincronización entre usuarios, backend o red.
- Tests automatizados, runners o dependencias: la verificación es manual en navegador.
- Interfaz para editar precios: la consigna dice explícitamente que no se exige.

## Decisions

1. **Módulo nuevo `js/persistencia.js`, cargado antes de `js/datos.js`.** Expone `window.LibreriaPersistencia` con `leer()`, `escribir()` y las constantes de claves. Se agrega `<script src="js/persistencia.js">` antes de `js/datos.js` en `index.html`.
   - *Alternativa*: meter todo dentro de `js/datos.js`. Descartada: `datos.js` modela los datos; el acceso al almacenamiento es una responsabilidad aparte y queda aislado y reutilizable.
   - *Alternativa*: cargar `persistencia.js` después de `datos.js` y hacer el restore en un evento. Descartada: habría una ventana en la que el catálogo se renderiza con la siembra y luego se reemplaza (parpadeo y doble render).

2. **Claves separadas por entidad, más una bandera de versión.** En `localStorage`:
   - `libreriaAurora:version` → `"1"` (texto plano): la bandera de siembra única.
   - `libreriaAurora:libros` → JSON con el arreglo de libros.
   - `libreriaAurora:clientes` → JSON con el arreglo de clientes.
   - `libreriaAurora:ventas` → JSON con el arreglo de ventas.
   - *Alternativa*: una sola clave con `{version, libros, clientes, ventas}`. Descartada: el caso 6 pide que el docente altere **únicamente el precio de un libro del catálogo guardado**; con una clave única tendría que editar un JSON anidado, mientras que con una clave por entidad edita un arreglo plano de libros y deja las ventas intactas por construcción. La escritura por clave también es más fácil de depurar desde la consola.
   - *Alternativa*: guardar el precio como texto formateado. Descartada: el valor guardado debe seguir siendo numérico para que `Number(precio).toFixed(2)` siga funcionando sin conversiones.

3. **Los datos literales NO se persisten.** `editoriales`, `generos` y `autores` quedan fijos en `js/datos.js`.
   - *Justificación*: la consigna (§9.1) solo pide persistir libros, clientes y ventas, y §6.6 deja los literales fuera de alcance de administración: no se dan de alta, no se editan y no se eliminan desde la interfaz, así que nunca cambiaran. Persistirlos agregaría tres claves sin comportamiento observable y abriría la puerta a estados inconsistentes (por ejemplo, un libro guardado que apunte a una editorial que el código ya no tiene).

4. **`storageVersion` decide siembra, no de versión de formato.** La lógica al cargar es:
   - si `libreriaAurora:version` no existe → se siembra (6 libros, 3 clientes, 0 ventas) y se escribe todo;
   - si existe pero su valor no es el de la aplicación → se vuelve a sembrar y se actualiza la bandera (permite invalidar datos viejos si cambia el formato);
   - si existe y coincide → se restauran las claves guardadas.
   Cada clave se lee por separado dentro de `try/catch`: si una falla (JSON inválido) o no tiene la forma esperada (no es un arreglo), esa entidad vuelve a su valor inicial y se reescribe, y las demás se conservan.

5. **Una función `escribir()` que serializa el estado completo.** `LibreriaPersistencia.escribir()` toma `window.LibreriaDatos` y escribe `libros`, `clientes` y `ventas`. Se invoca **después** de cada mutación: en `altas.js` tras `datos.libros.push(...)` y `datos.clientes.push(...)`, y en `ventas.js` tras `datos.ventas.push(venta)`.
   - *Alternativa*: escribir solo la entidad modificada. Descartada: escribir el estado completo es más simple de razonar y mantiene las claves coherentes entre sí; el volumen de datos del TPI es trivial.
   - La escritura se hace **después** del `push` y no antes, para no guardar un estado a medio construir.

6. **Restauración sin tocar la forma de los datos.** El JSON guardado es el mismo arreglo que ya vive en memoria, sin transformaciones: cada libro `{id, titulo, isbn, precio, editorialId, generoId, autorIds}`, cada cliente `{id, nombre, email}`, cada venta `{id, fecha, clienteId, cliente, renglones, total}`. Esto preserva la **copia histórica del precio unitario** (`precioUnitario` y `subtotal` viven dentro de cada renglón guardado), de modo que el caso 6 funciona sin tocar `js/ventas.js`: el detalle sigue armándose solo con `datos.ventas`.
   - *Consecuencia*: `js/ventas.js` no necesita ningún cambio para leer del historial; solo la llamada a `escribir()`.

7. **Los ids siguen siendo los del alta en memoria.** El id de libro nuevo es `'lib' + (datos.libros.length + 1) + '_' + Date.now()` y el de venta es `'venta-' + (datos.ventas.length + 1)`: al restaurar, `length` ya cuenta los registros guardados, así que no se repiten. El caso 7 (recarga sin duplicados) lo verifica.

8. **Textos de estado del documento actualizados.** `index.html` deja de decir que la persistencia está pendiente en el aviso de estado, en el `<noscript>` y en el pie de página, y pasa a listarla como operativa. No se agregan vistas ni controles nuevos: la estructura HTML no cambia salvo el orden de un `<script>`.

9. **Verificación manual y registrada, sin automatable.** Los 8 casos de la §10 se ejecutan en un navegador real; el README §8 registra, por caso, el resultado esperado y el resultado observado. El caso 6 se ejecuta **en una copia de prueba** del proyecto (como pide la consigna): se confirma una venta, se anota el precio del catálogo, se edita en DevTools el precio del libro en `libreriaAurora:libros` y se recarga. La consigna es explícita en que la comprobación es guiada por el docente.
   - *Restricción*: no se agrega ningún script de pruebas al proyecto ni se convierte en dependencia; cualquier guion auxiliar usado para la ejecución queda fuera de la entrega.

## Risks / Trade-offs

- [Un `localStorage` no disponible o bloqueado (modo privado restrictivo, `file://` con políticas del navegador)] → la escritura se envuelve en `try/catch` y la aplicación sigue funcionando en memoria; el aviso visible en el README explica que la persistencia depende del navegador, del perfil y de la ubicación de apertura.
- [El contenido guardado quedó con una forma inesperada] → la validación por clave descarta solo la entidad afectada, la vuelve a sembrar y reescribe; el resto de los datos sobrevive.
- [Cambiar la bandera de versión invalida datos ya guardados] → es intencional: es el mecanismo para migrar el formato; se documenta en el README.
- [Edición manual del JSON guardado por el docente puede dejar datos inválidos] → la aplicación valida la forma al cargar y cae a la siembra, sin romper; el README documenta qué campos son los editables.
- [El precio de un libro guardado puede quedar desincronizado con las ventas ya registradas] → es exactamente lo que el caso 6 quiere comprobar: la venta conserva su precio histórico porque el renglón guardó su propia copia.
- [Sin ejecución automatizada, los casos del README dependen de que alguien los ejecute] → mitigado con la regla de `AGENTS.md` §13.6: ningún caso se marca aprobado sin ejecutarse, y cada registro dice fecha y navegador usado.
- [Verificar el caso 6 exige un navegador con DevTools] → si en el momento de la entrega no hay navegador disponible, el README lo declara como pendiente con su resultado real, en lugar de afirmar que pasó.
