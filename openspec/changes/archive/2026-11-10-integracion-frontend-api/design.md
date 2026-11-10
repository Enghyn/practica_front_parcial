# Design

## Context

El repositorio unificado (`libreria-global/`) contiene `frontend/` y `backend/`. El backend es una
copia byte a byte de `prog_segundo_parcial/despliegue/` (TP capítulos 1 a 4): sin autenticación,
sin stock transaccional y con contrato `limit`/`offset` y respuestas planas. El frontend es una
página única con cinco secciones, CSS propio y cinco módulos JS que hoy trabajan contra arrays
locales y `localStorage`.

Restricciones del contrato que condicionan el diseño:

- `GET /libros/` devuelve un **array plano**, no un objeto paginado: no hay `total` ni `pages`.
- No existen `GET /autores/` ni `GET /clientes/`; solo consultas por identificador.
- Los importes viajan como **texto decimal** (`"1500.00"`) y las fechas como ISO 8601.
- `GET /libros/{id}` es la única vía para conocer los autores de un libro.
- `POST /libros/` usa `stock` (no `stock_inicial`) y `autores: [{autor_id, rol, orden}]`.
- `POST /ventas/` solo acepta `cliente_id` y `renglones: [{libro_id, cantidad}]`; el total lo
  calcula el servidor.
- El despliegue servirá el frontend bajo `/api` mediante Nginx, por lo que la URL base debe ser
  relativa.

## Goals / Non-Goals

**Goals:**

- Reemplazar la fuente de datos local por la API sin rediseñar las pantallas existentes.
- Mantener HTML, CSS y JavaScript nativos, sin dependencias, bundlers ni módulos ES.
- Aislar el acceso HTTP para que las vistas no construyan URLs ni interpreten códigos de estado.
- Cubrir los cuatro estados de cada vista (carga, vacío, sin coincidencias, error).
- Permitir desarrollo local sin Docker, con el mismo contrato relativo `/api` que producción.
- Dejar el comportamiento puro (consultas, paginación, importes, errores) cubierto por pruebas
  ejecutables con Node.

**Non-Goals:**

- Autenticación, roles o stock transaccional (corresponden al backend de capítulos 1 a 6).
- Listados de autores o clientes: la API no los expone y no se modifica el backend para agregarlos.
- Migrar a módulos ES, TypeScript, framework de UI o herramienta de build.
- Persistencia en el navegador: se elimina por completo.

## Decisions

### D1 — Capa de datos en módulos IIFE con exportación dual

Cada archivo se envuelve en un IIFE que publica su API en `window` y, si existe `module`, también en
`module.exports`. Motivo: el navegador los carga con `<script defer>` sin módulos ES —lo que evita
problemas de CORS y de `file://`— y Node puede requerirlos para las pruebas sin bundler.

Alternativa descartada: `<script type="module">`. Requiere servir por HTTP, impone rutas relativas
estrictas y complica el testeo sin agregar valor en un proyecto sin dependencias.

### D2 — Separación `nucleo` / `api` / `estado`

- `nucleo.js`: funciones puras y testeables (construcción de consultas, aritmética de paginación,
  normalización de importes e identificadores, traducción de errores).
- `api.js`: única capa que conoce `fetch`, la URL base y los códigos de estado.
- `estado.js`: cachés en memoria de la sesión (editoriales, géneros, clientes y autores consultados,
  autores por libro). No persiste nada.

Motivo: las vistas consumen una API semántica (`obtenerLibros`, `crearVenta`) y las pruebas atacan
la lógica pura sin simular el DOM.

### D3 — Paginación sin `total`

Como la API no devuelve el total, la interfaz calcula los controles con `recibidos === limit` para
habilitar «siguiente» y `offset > 0` para «anterior», y muestra el rango visible. Se documenta en el
README para que la decisión quede explícita.

Alternativa descartada: pedir todas las páginas para calcular el total. Multiplica peticiones y no
aporta a la consigna.

### D4 — Autores por identificador, con caché de sesión

El formulario de alta pide el `autor_id`, valida con `GET /autores/{id}` y guarda el nombre en
memoria. La tabla de autorías muestra nombre, rol y orden. En el catálogo, cada tarjeta ofrece «Ver
autores», que consulta `GET /libros/{id}` y cachea el resultado.

Motivo: es la única vía que permite el backend desplegado y la consigna la contempla explícitamente.

### D5 — Clientes por identificador, más los conocidos en la sesión

La venta permite buscar un cliente por ID (`GET /clientes/{id}`) y lo agrega a una lista en memoria;
los clientes creados con `POST /clientes/` se agregan a esa misma lista. Así el flujo de venta es
usable sin un endpoint de listado y sin persistencia.

### D6 — Borrador de venta en memoria y confirmación con el servidor

Los renglones viven en memoria mientras se compone la venta (la consigna lo permite). Al confirmar,
el cuerpo se reduce a `cliente_id` y `renglones[{libro_id, cantidad}]`; la respuesta 201 reemplaza
los importes mostrados. Ante 409/422 o error de red, el borrador no se toca. El botón se deshabilita
con una bandera de envío en curso y `aria-busy`.

### D7 — Formato de importes y fechas

Los importes se muestran con dos decimales y separador decimal punto (`$ 1500.00`), igual que el
frontend anterior, para no introducir ambigüedad entre el número enviado y el mostrado. Las fechas
ISO se muestran con `toLocaleString('es-AR')`. Un importe no convertible se muestra como `—`.

### D8 — Servidor de desarrollo propio, sin dependencias

Se agrega `frontend/dev_server.py` (solo biblioteca estándar) que sirve `public/` y reenvía `/api/*`
a `http://127.0.0.1:8000` quitando el prefijo, replicando la regla de Nginx. Motivo: no hay Docker en
el equipo de desarrollo y así se verifica el mismo contrato relativo que producción, sin CORS.

### D9 — Pruebas con `node --test`

`nucleo.js` se prueba con el runner integrado de Node (sin dependencias) cubriendo consultas,
paginación, normalización y errores. Las vistas se verifican manualmente con los casos G-01 a G-07
del enunciado y con capturas en `evidencia/`.

### D10 — Documentación alineada al nuevo alcance

`frontend/AGENTS.md` y `frontend/README.md` dejan de declarar «sin backend» y «sin fetch»; se
actualizan los casos manuales y se documenta la decisión de autores y clientes por identificador.

## Risks / Trade-offs

- **Backend sin listados**: la UX de autores y clientes depende de conocer identificadores. Se
  mitiga con la caché de sesión, la búsqueda por ID y la documentación de la decisión.
- **Sin `total` en la paginación**: no se puede mostrar «página X de Y». Se acepta y se muestra el
  rango visible.
- **Copia del backend en dos repositorios**: `backend/` debe mantenerse idéntico a
  `despliegue/`. Se verifica por hash antes de la entrega y se documenta la fuente de verdad.
- **Importes como texto**: cualquier comparación numérica debe pasar por la normalización; se cubre
  con pruebas para evitar `NaN` silenciosos.
- **Datos ficticios compartidos**: las pruebas G-02 a G-06 crean registros reales en la base
  desplegada; se usan ISBN y emails ficticios y se documenta cuáles se crearon.
