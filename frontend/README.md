# Frontend — Librería Aurora

Frontend en HTML, CSS y JavaScript nativos conectado a la API de la librería. No usa frameworks,
bundlers ni dependencias de ejecución: los archivos de `public/` se sirven tal cual.

## Estructura

```
frontend/
├── Dockerfile                imagen nginx que publica public/ y proxya /api
├── .dockerignore
├── default.conf.template     plantilla de Nginx con ${API_UPSTREAM}
├── dev_server.py             servidor local sin dependencias (sirve public/ y proxya /api)
├── package.json              sólo para ejecutar las pruebas con node --test
├── public/
│   ├── index.html
│   ├── css/estilos.css
│   └── js/
│       ├── config.js         URL base /api y límites, en un único lugar
│       ├── nucleo.js         funciones puras: consultas, paginación, importes, errores
│       ├── formato.js        importes y fechas
│       ├── api.js            cliente HTTP (fetch, tiempo de espera, ErrorApi)
│       ├── estado.js         cachés de la sesión y carga del catálogo
│       ├── catalogo.js       catálogo, búsqueda, paginación y autores
│       ├── altas.js          alta de libros con autorías, alta y búsqueda de clientes
│       ├── ventas.js         composición y confirmación de la venta
│       ├── historial.js      historial paginado y detalle
│       └── inicio.js         arranque ordenado de las vistas
└── tests/                    pruebas de la capa de datos con node:test
```

Orden de carga: `config` → `nucleo` → `formato` → `api` → `estado` → vistas → `inicio`, todos con
`defer`.

## Ejecución

```powershell
python dev_server.py                          # contra la API pública
python dev_server.py --destino http://127.0.0.1:8000   # contra un backend local
```

Abre <http://127.0.0.1:8080>. El servidor replica la regla de Nginx: `/api/libros/` se reenvía como
`/libros/`.

## Pruebas

```powershell
npm test
```

Cubren `nucleo.js`, `api.js`, `formato.js` y `estado.js`: construcción de consultas, paginación sin
total, normalización de importes e identificadores, traducción de errores y recarga paginada.

## Contrato de la API

| Uso | Petición |
|---|---|
| Catálogo | `GET /libros/?limit&offset&titulo` (array plano) |
| Autores de un libro | `GET /libros/{id}` |
| Opciones de alta | `GET /editoriales/`, `GET /generos/` |
| Verificar autor | `GET /autores/{id}` |
| Alta de libro | `POST /libros/` |
| Alta de cliente | `POST /clientes/` |
| Buscar cliente | `GET /clientes/{id}` |
| Confirmar venta | `POST /ventas/` |
| Historial | `GET /ventas/?limit&offset` |
| Detalle de venta | `GET /ventas/{id}` |
| Salud | `GET /health/ready` |

## Decisiones

- **Sin `localStorage`**: la API es la única fuente de verdad. La caché de clientes, autores y
  autorías vive en memoria y se pierde al recargar.
- **Autores y clientes por identificador**: el backend de los capítulos 1 a 4 no expone listados.
- **Paginación sin total**: la página siguiente se habilita cuando la cantidad recibida es igual al
  `limit` solicitado.
- **Importes**: la API los envía como texto decimal; se normalizan para calcular y se muestran con
  dos decimales. Al confirmar una venta se muestran los importes que devuelve el servidor.
- **Estados explícitos**: carga, vacío, sin coincidencias y error de conexión tienen mensajes
  distintos; el error ofrece reintento y nunca se confunde con «no hay datos».
- **Borrador de venta**: se conserva íntegro ante 409, 422 o falla de red. El botón de confirmar se
  deshabilita mientras la petición está en curso.
