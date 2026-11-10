# Despliegue — aplicación integrada

Este documento registra cómo se publica la aplicación completa: el backend del TP de los capítulos
1 a 4 y el frontend como imagen Nginx, los dos como servicios App del mismo proyecto de Easypanel.

## Estado del despliegue

| Dato | Valor |
|---|---|
| Proyecto de Easypanel | `grupo-acgs` |
| Repositorio del frontend | `https://github.com/Enghyn/practica_front_parcial`, rama `main` |
| Servicio backend | `libreria-api` — build path `despliegue/` (repositorio del segundo parcial) |
| Servicio frontend | `frontend` — build path `frontend/` (este repositorio) |
| URL pública del frontend | <https://front.enzogiaquinta.me/> (HTTPS) |
| URL pública de la API | ninguna: el backend queda en la red interna |
| Imagen del frontend | `nginx:1.30-alpine` con `public/` y la plantilla de proxy |
| Base de datos | PostgreSQL 16 del mismo proyecto; head de Alembic `5f67a857f685` (migración 0002) |
| Puerto interno del backend | `8000` |
| Puerto interno del frontend | `80` (Easypanel recibe HTTPS y habla HTTP) |

## Arquitectura

```
navegador ── HTTPS ──> [frontend: nginx :80] ── /api/* ──> [backend: uvicorn :8000] ──> PostgreSQL
                              │
                              └── archivos estáticos de public/
```

Un solo origen: el navegador pide `/api/libros/` al dominio del frontend y Nginx reescribe el prefijo
y resuelve `backend:8000` por la red interna. Por eso la interfaz usa `/api` como URL base y no
necesita CORS en producción.

## Servicios en Easypanel

### Backend (`libreria-api`)

Ya está desplegado. Para esta entrega sólo cambia `main.py`, que suma el middleware de CORS.

- **Source**: repositorio del segundo parcial, build path `despliegue/`.
- **Builder**: Dockerfile (`despliegue/Dockerfile`).
- **Comando de arranque** (ya incluido en la imagen):
  `alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000`.
- **Healthcheck**: `GET /health/ready` (`python:3.12-alpine`, usuario `app`).
- **Dominio**: sin dominio público; sólo red interna.

### Frontend (`frontend`)

- **Source**: este repositorio (`Enghyn/practica_front_parcial`), rama `main`, **build path `frontend/`**.
- **Builder**: Dockerfile, ruta relativa `Dockerfile`.
- **Environment**: `API_UPSTREAM=<nombre-interno-del-backend>:8000`.
  El patrón de Easypanel es `<proyecto>_<servicio>`; con el proyecto `grupo-acgs` y el servicio
  `libreria-api` el valor a confirmar en el panel es `grupo-acgs_libreria-api:8000`.
  No lleva `http://` ni barra final.
- **Domains**: el dominio HTTPS asignado, protocolo interno **HTTP**, puerto de destino **80**.

## Variables de entorno

Se documentan sólo los nombres. Los valores reales se cargan en el entorno privado de cada servicio.

### Backend

| Variable | Obligatoria | Descripción |
|---|---|---|
| `POSTGRES_USER` | sí | usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | sí | contraseña de PostgreSQL |
| `POSTGRES_DB` | sí | nombre de la base |
| `POSTGRES_HOST` | sí | host de la base en la red interna |
| `POSTGRES_PORT` | sí | puerto de la base (`5432`) |
| `POOL_SIZE` | no | tamaño del pool (por omisión 5) |
| `SQL_ECHO` | no | log de SQL (por omisión `false`) |

La aplicación **deriva** la URL: `postgresql+asyncpg://<usuario>:<clave>@<host>:<puerto>/<base>`.
No define una variable `DATABASE_URL`; si se carga, se ignora.

### Frontend

| Variable | Obligatoria | Descripción |
|---|---|---|
| `API_UPSTREAM` | sí | `host:puerto` interno del backend, sin esquema ni barra final |

`NGINX_ENVSUBST_FILTER=^API_UPSTREAM$` está fijada en la imagen para que Nginx sustituya únicamente
esa variable en la plantilla.

## Proxy

`frontend/default.conf.template`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://${API_UPSTREAM}/;
    }
}
```

La barra final de `proxy_pass` hace que `/api/libros/` llegue a FastAPI como `/libros/`. Las rutas de
colección conservan su barra final en el cliente para evitar el 307 de FastAPI.

## Migraciones y datos iniciales

- Las migraciones se aplican en cada arranque del backend (`alembic upgrade head`). La base ya está
  en `5f67a857f685`, así que un redespliegue no aplica cambios.
- La carga inicial se hace **una sola vez**, dentro del contenedor y con el servicio `healthy`:
  `docker exec <contenedor> python seed.py`. Es **destructivo** (`TRUNCATE` de las tablas de
  dominio): no debe ejecutarse sobre una base con datos que se quieran conservar.
- El seed de los capítulos 1 a 4 carga editoriales, géneros, autores, libros, clientes y ventas; no
  crea usuarios ni roles.

## Build local del frontend

```powershell
cd frontend
docker info                       # Docker debe responder
docker build -t libreria-frontend .
docker run --rm --name libreria-frontend -p 127.0.0.1:8080:80 `
  --add-host=host.docker.internal:host-gateway `
  -e API_UPSTREAM=host.docker.internal:8000 libreria-frontend
```

En Docker Desktop se omite `--add-host`. Sin Docker disponible, el contrato equivalente se verifica
con `python dev_server.py`, que sirve `public/` y reenvía `/api/*` igual que Nginx.

## Verificación en la URL pública

```powershell
# 1) salud a través del proxy del frontend
Invoke-RestMethod https://front.enzogiaquinta.me/api/health/ready

# 2) catálogo
Invoke-RestMethod "https://front.enzogiaquinta.me/api/libros/?limit=2&offset=0"

# 3) el sitio responde por HTTPS
Invoke-WebRequest https://front.enzogiaquinta.me/ -UseBasicParsing | Select-Object StatusCode
```

Verificado el 2026-11-10: `/api/health/ready` → 200 `{"status":"ok"}`, catálogo con 6 libros y
`OPTIONS` del backend con `access-control-allow-origin: *`.

Los casos funcionales G-01 a G-07 están registrados en `evidencia/`.

## Actualización

1. **Backend**: push al repositorio del segundo parcial → Easypanel reconstruye con build path
   `despliegue/` → Deploy → revisar los logs (`alembic upgrade head` y `uvicorn`).
2. **Frontend**: push a este repositorio → Easypanel reconstruye con build path `frontend/` → Deploy.
3. **Verificación**: `/api/health/ready` en 200 y un alta de prueba. Los datos viven en PostgreSQL:
   reemplazar los contenedores no los altera.

### Rollback

En Easypanel, volver a la revisión anterior del servicio y redesplegar. La base no se toca, porque
las migraciones ya aplicadas no se revierten automáticamente.

## Diagnóstico

| Síntoma | Revisar |
|---|---|
| Falla un `COPY` del frontend | Build path `frontend/`, nombres exactos de `Dockerfile`, `default.conf.template` y la carpeta `public/` |
| Nginx no arranca | `API_UPSTREAM` ausente o con formato inválido (debe ser `host:puerto`, sin `http://` ni barra final) |
| `/api/` devuelve 502 | Logs del frontend, valor de `API_UPSTREAM`, nombre interno del backend y que el backend esté corriendo |
| `/api/health/ready` falla | Logs del backend, variables `POSTGRES_*`, conexión a PostgreSQL y migraciones |
| Una petición de la API devuelve 404 | Prefijo `/api` y barra final de la ruta (`/api/libros/`, `/api/ventas/`); `/api/health/ready` va sin barra |
| El catálogo aparece vacío | `seed.py` no se ejecutó o se ejecutó sobre otra base; revisar `GET /api/libros/` |

## Nota sobre CORS

El backend de los capítulos 1 a 4 habilita `CORSMiddleware` con `allow_origins=["*"]` y
`allow_credentials=False`. Sirve para el desarrollo local, donde el frontend puede servirse en otro
puerto; en producción no interviene porque front y API comparten origen. No debe copiarse a un
backend con cookies o tokens.

## Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-08 | Backend desplegado en Easypanel (`libreria-api`, build path `despliegue/`). |
| 2026-11-10 | Frontend integrado a la API, imagen Nginx y `dev_server.py`; CORS en el backend. |
| 2026-11-10 | Backend redesplegado con CORS (OPTIONS 200, `access-control-allow-origin: *`). |
| 2026-11-10 | Servicio `frontend` publicado en <https://front.enzogiaquinta.me/>; verificación G-07. |
