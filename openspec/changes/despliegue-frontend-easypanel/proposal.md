# Proposal

## Why

La aplicación ya funciona contra la API, pero todavía no se puede publicar: el frontend se abre
desde el sistema de archivos, no existe imagen Docker y no hay una URL pública que demuestre el
flujo completo. La Evaluación Global exige una imagen Nginx del frontend, dos servicios App en
Easypanel dentro del mismo proyecto, el proxy `/api`, la URL por HTTPS y evidencia de los casos
G-01 a G-07, incluida la persistencia después de un redespliegue.

## What Changes

- Se separa la web en `frontend/public/` y se agrega `frontend/Dockerfile`,
  `frontend/.dockerignore` y `frontend/default.conf.template` con la imagen oficial de Nginx y la
  sustitución de `API_UPSTREAM` por `envsubst`.
- Se agrega `frontend/dev_server.py`, un servidor de desarrollo sin dependencias que sirve
  `public/` y reenvía `/api/*` al backend, para verificar el mismo contrato relativo sin Docker.
- Se habilita CORS en el backend desplegado (capítulos 1 a 4) para permitir el desarrollo local
  desde otro origen. En producción no se usa, porque Nginx publica front y API bajo el mismo origen.
- Se documentan el despliegue y la operación en `DEPLOY.md`: URL pública, revisión, rutas de build,
  puertos, proxy, variables, migraciones, carga inicial y pasos de actualización.
- Se documentan los casos G-01 a G-07 con pasos, resultado observado y evidencia en `evidencia/`.
- Se actualiza `README.md` con la identificación del grupo, la ejecución local y la carga de datos
  de prueba, y se prepara el ZIP de entrega con `frontend/`, `backend/`, `README.md`, `DEPLOY.md` y
  `evidencia/`.

## Capabilities

### New Capabilities

- `imagen-frontend`: imagen Docker reproducible que sirve solo archivos públicos y publica la API
  bajo `/api` mediante una plantilla de Nginx configurable por variable de entorno.
- `despliegue-publico`: dos servicios App en Easypanel, dominio HTTPS del frontend, comunicación
  interna con el backend y verificación del flujo completo sobre datos persistentes.

### Modified Capabilities

<!-- Ninguna: el backend conserva su contrato; solo se agrega CORS, que no cambia el comportamiento
     observable de los endpoints para los clientes que ya funcionaban. -->

## Impact

- **Archivos nuevos**: `frontend/Dockerfile`, `frontend/.dockerignore`,
  `frontend/default.conf.template`, `frontend/dev_server.py`, `DEPLOY.md`, `evidencia/*`.
- **Backend**: `main.py` del servicio desplegado suma `CORSMiddleware` con orígenes abiertos y sin
  credenciales. No cambia ningún endpoint, esquema ni migración.
- **Infraestructura**: un servicio App nuevo (`frontend`) y el redespliegue del servicio `backend`
  existente en el proyecto de Easypanel; PostgreSQL no se toca.
- **Entrega**: ZIP con ambos componentes, README, DEPLOY.md y evidencia, sin `.env` ni credenciales.
