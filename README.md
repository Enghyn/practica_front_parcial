# Librería Aurora — Evaluación Global de Programación III

Aplicación integrada de la librería: frontend en HTML, CSS y JavaScript nativos conectado a la API
de FastAPI del TP «Librería: catálogo, clientes y ventas con FastAPI y PostgreSQL» (capítulos 1 a 4),
con los datos persistidos en PostgreSQL y el frontend publicado como imagen Nginx.

- **Frontend público**: <https://libreria.enzogiaquinta.me/>
- **API**: servicio interno del proyecto de Easypanel; se consume bajo `/api` desde el frontend.
- **Repositorio**: <https://github.com/Enghyn/practica_front_parcial> (rama `main`).
- **Repositorio del backend**: el servicio se despliega desde el repositorio del segundo parcial con
  build path `despliegue/`. La copia entregada está en `backend/` y es idéntica.

## Integrantes

**Grupo Aura**

- Enzo Giaquinta
- Agustín Contardi
- Fernando Torrez
- Ignacio Sánchez
- Ramiro Salcedo

## Estructura

```
libreria-global/
├── frontend/
│   ├── Dockerfile                 imagen nginx del frontend
│   ├── .dockerignore
│   ├── default.conf.template      proxy /api -> API_UPSTREAM
│   ├── dev_server.py              servidor local sin dependencias
│   ├── package.json               solo para `node --test`
│   ├── public/                    único contenido publicado
│   │   ├── index.html
│   │   ├── css/estilos.css
│   │   └── js/                    config, nucleo, formato, api, estado y vistas
│   └── tests/                     pruebas de la capa de datos con node:test
├── backend/                       API FastAPI capítulos 1 a 4 (copia de despliegue/)
├── evidencia/                     casos G-01 a G-07
├── openspec/                      cambios y especificaciones del trabajo
├── README.md
└── DEPLOY.md
```

## Requisitos

- Para el frontend: un navegador y, si se quieren correr las pruebas, Node 20 o superior.
- Para el backend local: Python 3.12 y PostgreSQL 16.
- Para la imagen: Docker (o el build de Easypanel).

## Ejecución local

### Opción A — frontend contra la API pública (sin Docker, sin PostgreSQL)

```powershell
cd frontend
python dev_server.py
```

Abre <http://127.0.0.1:8080>. El servidor sirve `public/` y reenvía `/api/*` a la API pública, con la
misma semántica que Nginx. Para apuntar a un backend local:

```powershell
python dev_server.py --destino http://127.0.0.1:8000
```

### Opción B — backend local completo

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item env.example .env      # completar POSTGRES_*
alembic upgrade head
python seed.py                  # destructivo: sólo sobre una base vacía
uvicorn main:app --host 0.0.0.0 --port 8000
```

En otra terminal, `cd frontend && python dev_server.py --destino http://127.0.0.1:8000`.

### Opción C — imagen del frontend

```powershell
cd frontend
docker build -t libreria-frontend .
docker run --rm --name libreria-frontend -p 127.0.0.1:8080:80 `
  --add-host=host.docker.internal:host-gateway `
  -e API_UPSTREAM=host.docker.internal:8000 libreria-frontend
```

En Docker Desktop se omite `--add-host`. La explicación completa está en [`DEPLOY.md`](DEPLOY.md).

## Datos de prueba

La base de la aplicación desplegada ya tiene datos ficticios cargados con `backend/seed.py`:
editoriales, géneros, autores, libros, clientes y ventas. El script es **destructivo** (`TRUNCATE` de
las tablas de dominio): sólo debe ejecutarse sobre una base vacía, nunca sobre la base en línea.

Los datos creados durante la verificación de los casos G-02 a G-06 están identificados en
`evidencia/`. Son ficticios y se distinguen por el ISBN `978-GLOBAL-0001-X` y el email
`cliente.global@ejemplo.com`.

## Pruebas

```powershell
cd frontend
npm test          # equivale a: node --test tests
```

Cubren la lógica pura de la capa de datos: construcción de consultas, paginación sin total,
normalización de importes e identificadores, traducción de errores HTTP y recarga paginada de
opciones. Las vistas se verifican con los casos G-01 a G-07 documentados en `evidencia/`.

## Decisiones de integración

El backend de los capítulos 1 a 4 tiene un contrato más acotado que el del parcial completo. Estas
decisiones están registradas en `openspec/changes/integracion-frontend-api/`:

- **Autores por identificador.** No existe `GET /autores/`: cada autoría se verifica con
  `GET /autores/{id}` antes de agregarla y el nombre queda en memoria durante la sesión.
- **Clientes por identificador.** No existe `GET /clientes/`: la venta usa los clientes registrados
  o consultados en la sesión mediante `GET /clientes/{id}`.
- **Paginación sin total.** `GET /libros/` y `GET /ventas/` devuelven listas planas con `limit` y
  `offset`; la página siguiente se habilita cuando la cantidad recibida es igual al `limit`.
- **Importes como texto.** La API serializa `precio`, `total`, `precio_unitario` y `subtotal` como
  cadenas decimales; la interfaz las normaliza antes de calcular y solo muestra los importes que
  devuelve el servidor al confirmar una venta.
- **Sin persistencia local.** Se eliminó `localStorage`: los registros y los importes confirmados
  provienen de la API y viven en PostgreSQL.
- **CORS sólo para desarrollo.** En producción el frontend y la API comparten origen a través de
  Nginx; el backend habilita CORS para poder servirse desde otro puerto en desarrollo.

## Alcance

Cubre catálogo con búsqueda y paginación, altas de libros y clientes, venta e historial con importes
históricos, la imagen Docker del frontend y el despliegue en Easypanel. No incluye autenticación,
roles, panel de administración ni movimientos de stock: eso pertenece al backend de los capítulos
1 a 6, que no forma parte de esta entrega.
