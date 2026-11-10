# Proposal

## Why

El frontend del primer parcial simula las altas y las ventas en el navegador: no hace ninguna
petición de red y persiste todo en `localStorage`. La Evaluación Global exige reutilizar esas
pantallas conectadas a la API real de «la librería» (capítulos 1 a 4), de modo que los registros y
los importes confirmados provengan de la API y queden en PostgreSQL. Hoy el front no puede cumplir
eso: los identificadores de sus datos semilla (`lib1`, `ed1`, `gen1`) no existen en la base, el
formulario de libros no tiene stock ni autorías con rol y orden, y no hay cliente HTTP, estados de
carga ni manejo de errores HTTP.

## What Changes

- **BREAKING** Se retiran `js/datos.js` y `js/persistencia.js`. La fuente de verdad pasa a ser la
  API: no se siembran libros, clientes ni ventas en el navegador y no se escribe en `localStorage`.
- Se agrega un cliente HTTP centralizado (`js/api.js`) con la URL base `/api`, `fetch` con
  `Accept: application/json`, parseo de errores 404/409/422/500 y errores de conexión.
- Se agregan módulos de soporte: `js/nucleo.js` (funciones puras: consulta, paginación, importes,
  errores), `js/formato.js` (importes y fechas), `js/estado.js` (cachés en memoria de la sesión) y
  `js/inicio.js` (arranque ordenado).
- **Catálogo**: `GET /libros/` con `limit` (1..100, por defecto 20), `offset` y `titulo`; el filtro
  reinicia el desplazamiento. Se muestran título, ISBN, precio, editorial y género; los autores se
  consultan con `GET /libros/{id}`. Género nulo se muestra como «Sin clasificar». Se distinguen
  carga, lista vacía, búsqueda sin coincidencias y error de conexión.
- **Alta de libros**: se agrega el campo `stock` (entero desde cero) y se reemplaza el selector
  múltiple de autores por filas de autoría (`autor_id`, `rol`, `orden`), con verificación previa por
  `GET /autores/{id}`. Editoriales y géneros se cargan de `GET /editoriales/` y `GET /generos/`.
- **Alta de clientes**: `POST /clientes/` con nombre y email; se usa el registro devuelto (201) y se
  muestran los mensajes del servidor ante 409 y 422. Se agrega búsqueda por `GET /clientes/{id}`
  porque la API no expone listado.
- **Ventas**: el cliente se elige por ID verificado; los renglones se arman con el catálogo de la
  API; la confirmación envía **solo** `cliente_id` y `renglones[{libro_id, cantidad}]`. El total y
  los importes unitarios se toman de la respuesta. El botón se deshabilita durante el envío y el
  borrador se conserva ante 409/422.
- **Historial**: `GET /ventas/` con `limit` y `offset`; el detalle se abre con `GET /ventas/{id}` y
  muestra los importes históricos guardados en el renglón.
- Se actualizan `index.html`, `css/estilos.css`, `README.md` y `AGENTS.md` del frontend para
  reflejar que la aplicación ahora requiere la API y que las reglas «sin backend» y «sin fetch»
  dejaron de aplicar.

## Capabilities

### New Capabilities

- `cliente-http`: URL base centralizada, construcción de peticiones y consultas, y traducción de
  respuestas de error y fallas de conexión a mensajes para la interfaz.
- `catalogo-api`: consulta paginada del catálogo con búsqueda por título, detalle de autores por ID
  y estados de carga, vacío, sin coincidencias y error de conexión.
- `altas-api`: alta de libros con stock y autorías, alta de clientes, y consulta individual de
  autores y clientes como selectores.
- `ventas-historial`: composición, confirmación y consulta de ventas con importes históricos y
  manejo de rechazos sin perder el borrador.

### Modified Capabilities

<!-- Ninguna: el repositorio unificado no tiene specs previas y el frontend actual no está
     especificado en OpenSpec. -->

## Impact

- **Código**: `frontend/public/index.html`, `frontend/public/css/estilos.css`,
  `frontend/public/js/{api,nucleo,formato,estado,inicio,catalogo,altas,ventas,historial}.js`.
  Se eliminan `js/datos.js` y `js/persistencia.js`.
- **Documentación**: `frontend/README.md` y `frontend/AGENTS.md` dejan de declarar «sin backend»,
  «sin fetch» y persistencia en `localStorage`.
- **API consumida**: `GET /libros/`, `GET /libros/{id}`, `GET /editoriales/`, `GET /generos/`,
  `GET /autores/{id}`, `POST /libros/`, `POST /clientes/`, `GET /clientes/{id}`, `POST /ventas/`,
  `GET /ventas/`, `GET /ventas/{id}`, `GET /health/ready`.
- **Sin cambios de contrato en el backend**: esta integración solo consume los endpoints existentes.
  El CORS se trata en el change de despliegue.
- **Alcance**: no se agrega autenticación, stock transaccional ni panel de administración; el
  backend de referencia es el de los capítulos 1 a 4.
