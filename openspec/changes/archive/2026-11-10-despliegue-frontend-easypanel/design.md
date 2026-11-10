# Design

## Context

El backend ya está desplegado en Easypanel como servicio `libreria-api` (proyecto `grupo-acgs`),
con build path `despliegue/` sobre el repositorio del segundo parcial y PostgreSQL 16 en el mismo
proyecto. La URL pública actual es `https://libreria.enzogiaquinta.me`.

El frontend no se puede publicar todavía: no tiene Dockerfile, se abre con `file://` y su código
declara "sin backend". Además, el equipo de desarrollo no tiene Docker instalado, así que el build
local de la imagen no se puede ejecutar en esta máquina.

Restricciones:

- La guía fija la imagen `nginx:1.30-alpine`, la variable `API_UPSTREAM` con formato `host:puerto`
  y `NGINX_ENVSUBST_FILTER=^API_UPSTREAM$` para no sustituir otras variables de la plantilla.
- Easypanel recibe HTTPS y habla HTTP con Nginx en el puerto 80.
- La base ya está en la revisión `5f67a857f685` (migración 0002), que es el head del backend de
  capítulos 1 a 4. No hay que aplicar migraciones nuevas.
- El ZIP de entrega debe contener `frontend/`, `backend/`, `README.md`, `DEPLOY.md` y `evidencia/`.

## Goals / Non-Goals

**Goals:**

- Construir una imagen del frontend que solo exponga archivos públicos.
- Publicar front y API bajo el mismo origen para que la URL base `/api` funcione sin CORS.
- Mantener el backend intacto salvo CORS, para no arriesgar el contrato ya desplegado.
- Verificar el flujo completo sobre la URL pública y dejar evidencia reproducible.
- Permitir desarrollo local sin Docker con un servidor que replica el proxy de Nginx.

**Non-Goals:**

- Automatizar el despliegue con CI/CD o IaC.
- Cambiar la base, las migraciones o el contrato del backend.
- Publicar el backend con dominio propio: permanece en la red interna.
- Migrar a Docker Compose o a Kubernetes.

## Decisions

### D1 — Nginx oficial sin etapa de build

Se usa `nginx:1.30-alpine` con dos `COPY`: `public/` al directorio de Nginx y la plantilla a
`/etc/nginx/templates/`. Motivo: no hay toolchain de frontend que compilar y la imagen oficial ya
incluye `envsubst` al arrancar. Alternativa descartada: compilar con Node, que agregaría una etapa y
dependencias sin aportar nada a un sitio estático.

### D2 — `public/` como única raíz publicada

Todo lo que no debe verse por HTTP queda fuera de `public/`: `Dockerfile`, `.dockerignore`, la
plantilla de Nginx, `dev_server.py`, `package.json` y `tests/`. Motivo: reduce la superficie
expuesta y evita publicar tests o configuración. `try_files $uri $uri/ =404` no reescribe rutas
desconocidas hacia `index.html`, así los 404 de archivos se distinguen de los de la API.

### D3 — Proxy con barra final y variable de entorno

`proxy_pass http://${API_UPSTREAM}/;` con barra final reemplaza el prefijo `/api/`: `/api/libros/`
llega como `/libros/`. Se conserva la barra final de las rutas en el cliente para que la API no
responda 307. `NGINX_ENVSUBST_FILTER=^API_UPSTREAM$` limita la sustitución a esa variable.

### D4 — Mismo origen en producción, CORS solo para desarrollo

En producción el navegador pide `/api/...` al mismo origen del frontend y Nginx resuelve el backend
por la red interna: no hay CORS. Se habilita `CORSMiddleware` con `allow_origins=["*"]` y
`allow_credentials=False` para el desarrollo local, donde el frontend puede servirse en otro puerto.
El backend de capítulos 1 a 4 no usa cookies ni tokens, por lo que no se requiere credenciales.

### D5 — Servidor de desarrollo propio en lugar de Docker

`frontend/dev_server.py` (solo biblioteca estándar) sirve `public/` y reenvía `/api/*` al destino
indicado, con la misma semántica que Nginx. Motivo: no hay Docker en la máquina de desarrollo y así
se verifica el contrato relativo real en lugar de una variante con URL absoluta y CORS.

### D6 — Backend sin cambios funcionales

El único cambio en el backend es el middleware de CORS en `main.py`. No se toca el esquema, las
migraciones ni los routers. El repositorio de despliegue del backend conserva su build path, de modo
que un redespliegue no altera la base.

### D7 — Evidencia con datos ficticios y precios restaurados

Los casos G-02 a G-06 crean registros reales en la base desplegada. Se usan ISBN y emails ficticios
identificables. Para G-05 se cambia el precio de un libro y se restaura al valor original al
terminar, dejando registrado el valor usado y el resultado observado.

## Risks / Trade-offs

- **Dos repositorios**: el backend se despliega desde su repositorio y el frontend desde el
  repositorio unificado. `backend/` del repositorio unificado debe permanecer idéntico a
  `despliegue/`; se verifica por hash y se documenta la fuente de verdad. Riesgo de divergencia si
  alguien edita solo uno.
- **CORS abierto**: `allow_origins=["*"]` es aceptable porque no hay autenticación ni datos
  privados, pero no debe copiarse a un backend con sesiones.
- **Sin build local de Docker**: el Dockerfile se valida en el build de Easypanel. Si el build
  falla, el diagnóstico se hace por los logs del servicio, como indica la guía.
- **Variable `API_UPSTREAM` obligatoria**: si falta, Nginx no arranca. Se documenta en la tabla de
  diagnóstico de `DEPLOY.md`.
- **Datos de prueba en producción**: quedan registros ficticios en la base. Se identifican en la
  evidencia para no confundirlos con datos de la cátedra.
