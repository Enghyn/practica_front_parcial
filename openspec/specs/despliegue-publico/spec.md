# despliegue-publico Specification

## Purpose
Publica la aplicación integrada en dos servicios App de Easypanel bajo un dominio HTTPS, con la API en la red interna y datos persistentes en PostgreSQL.

## Requirements

### Requirement: Servicios del proyecto

El despliegue SHALL usar dos servicios App en el mismo proyecto de Easypanel: uno para el backend con build path `/backend` y otro para el frontend con build path `/frontend`, ambos construidos con su `Dockerfile`.

#### Scenario: Backend en la red interna

- **WHEN** el servicio backend queda desplegado
- **THEN** escucha en `0.0.0.0:8000`, aplica las migraciones al arrancar y no expone un dominio público

#### Scenario: Frontend con dominio HTTPS

- **WHEN** el servicio frontend queda desplegado
- **THEN** responde por HTTPS en el dominio asignado y publica el puerto 80 interno por HTTP

#### Scenario: Comunicación interna

- **WHEN** el frontend necesita la API
- **THEN** Nginx usa `API_UPSTREAM` con el nombre interno del servicio backend y su puerto

### Requirement: Salud de la aplicación publicada

La URL pública SHALL responder 200 en `/api/health/ready` y SHALL entregar el catálogo con datos.

#### Scenario: Salud desde el dominio público

- **WHEN** se solicita `https://<dominio>/api/health/ready`
- **THEN** la respuesta es 200 con `{"status":"ok"}`

#### Scenario: Catálogo con datos

- **WHEN** se abre el dominio público
- **THEN** el catálogo muestra los libros cargados en la base

#### Scenario: Backend detenido

- **WHEN** el servicio backend no está disponible
- **THEN** `/api/` responde 502 y la interfaz muestra el error de conexión, sin romper la navegación

### Requirement: Persistencia entre redespliegues

Los datos registrados SHALL conservarse al redesplegar cualquiera de los dos servicios, porque viven en PostgreSQL y no en el contenedor.

#### Scenario: Redespliegue del frontend

- **WHEN** se vuelve a desplegar el servicio frontend
- **THEN** el catálogo y el historial muestran los mismos registros que antes del redespliegue

#### Scenario: Redespliegue del backend

- **WHEN** se vuelve a desplegar el servicio backend
- **THEN** las migraciones se aplican sin pérdida de datos y las ventas anteriores conservan sus importes

### Requirement: Configuración versionada y reproducible

El repositorio SHALL incluir los Dockerfiles, la plantilla de Nginx, un archivo de ejemplo con los nombres de las variables y la documentación necesaria para reproducir el despliegue.

#### Scenario: Variables documentadas

- **WHEN** se revisa `DEPLOY.md`
- **THEN** figuran los nombres de las variables de ambos servicios, sin sus valores reales

#### Scenario: Reproducción del despliegue

- **WHEN** otra persona sigue `DEPLOY.md` sobre el mismo repositorio
- **THEN** obtiene los dos servicios con las mismas rutas de build, puertos y proxy

#### Scenario: Credenciales fuera de la entrega

- **WHEN** se prepara el ZIP
- **THEN** no incluye `.env`, credenciales reales ni dependencias instaladas

### Requirement: Verificación documentada

La entrega SHALL registrar los casos G-01 a G-07 con pasos, resultado observado y evidencia, y SHALL documentar la URL pública y los puertos.

#### Scenario: Casos ejecutados

- **WHEN** se revisa `evidencia/`
- **THEN** cada caso G-01 a G-07 tiene su registro con el resultado observado

#### Scenario: Datos ficticios

- **WHEN** se registran libros, clientes o ventas para las pruebas
- **THEN** los datos usados son ficticios y están identificados en la evidencia

#### Scenario: Valores privados ocultos

- **WHEN** la evidencia incluye capturas
- **THEN** las contraseñas y valores privados están ocultos
