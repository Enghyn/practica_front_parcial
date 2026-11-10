# Tasks

## 1. Imagen del frontend

- [x] 1.1 Separar la web en `frontend/public/` conservando rutas relativas
- [x] 1.2 Crear `frontend/Dockerfile` con `nginx:1.30-alpine` y `NGINX_ENVSUBST_FILTER`
- [x] 1.3 Crear `frontend/.dockerignore`
- [x] 1.4 Crear `frontend/default.conf.template` con el proxy `/api/` y la barra final
- [x] 1.5 Crear `frontend/dev_server.py` sin dependencias
- [x] 1.6 Verificar `node --check` y la suite `node --test` del frontend

## 2. Backend y CORS

- [x] 2.1 Agregar `CORSMiddleware` en `backend/main.py`
- [x] 2.2 Replicar el cambio en el repositorio que despliega el backend (`despliegue/main.py`)
- [x] 2.3 Verificar el preflight OPTIONS con `TestClient` (200 y `access-control-allow-origin: *`)
- [x] 2.4 Confirmar el contrato sin cambios: mismo `/openapi.json`, mismas migraciones

## 3. Verificación local

- [x] 3.1 Levantar `dev_server.py` y comprobar `/api/health/ready` en 200
- [x] 3.2 Verificar catálogo, búsqueda, autores y paginación
- [x] 3.3 Verificar alta de libro con autorías y stock, y el 409 de ISBN repetido
- [x] 3.4 Verificar alta de cliente, 409 de email repetido y búsqueda por ID
- [x] 3.5 Verificar venta con dos renglones, total del servidor y limpieza del formulario
- [x] 3.6 Verificar detalle tras recargar la página con importes históricos
- [x] 3.7 Verificar G-05 (cambio de precio) y G-06 (409 y 422) sin alterar el historial
- [x] 3.8 Verificar la conservación del borrador ante 409, 422 y error de conexión
- [x] 3.9 Verificar responsive a 390x844 y 1440x900 sin desborde horizontal

## 4. Publicación en Easypanel

- [x] 4.1 Publicar el repositorio unificado en GitHub
- [x] 4.2 Redesplegar el servicio backend con el cambio de CORS y verificar los logs
- [x] 4.3 Crear el servicio `frontend` con build path `/frontend` y `Dockerfile`
- [x] 4.4 Configurar `API_UPSTREAM` con el nombre interno del backend y el puerto 8000
- [x] 4.5 Asignar dominio HTTPS, protocolo interno HTTP y puerto 80
- [x] 4.6 Verificar `/api/health/ready` en 200 desde el dominio público
- [x] 4.7 Quitar el dominio público del backend si Easypanel asignó uno

## 5. Casos G-01 a G-07 y evidencia

- [x] 5.1 Ejecutar G-01 y guardar capturas en `evidencia/`
- [x] 5.2 Ejecutar G-02 y G-03, incluidos los 409
- [x] 5.3 Ejecutar G-04 y verificar el detalle después de recargar
- [x] 5.4 Ejecutar G-05 y restaurar el precio original
- [x] 5.5 Ejecutar G-06 y confirmar que el historial queda igual
- [x] 5.6 Ejecutar G-07: build, HTTPS, salud y persistencia tras redespliegue
- [x] 5.7 Escribir `evidencia/G-01.md` … `G-07.md` con pasos, resultado y datos usados

## 6. Documentación y entrega

- [x] 6.1 Escribir `DEPLOY.md` con URL, revisión, build paths, puertos, proxy, variables, migraciones, carga inicial y actualización
- [x] 6.2 Actualizar `README.md` con grupo, ejecución local, datos de prueba y estructura del repositorio
- [x] 6.3 Verificar que `backend/` sigue idéntico a `despliegue/` salvo `main.py`
- [x] 6.4 Generar el ZIP de entrega sin `.env`, credenciales ni dependencias
- [x] 6.5 Revisar que el ZIP contenga `frontend/`, `backend/`, `README.md`, `DEPLOY.md` y `evidencia/`
