# Spec Delta

## Purpose

Define una imagen Docker del frontend que sirva únicamente archivos públicos y reenvíe la API bajo el prefijo `/api` a un backend configurable por variable de entorno.

## ADDED Requirements

### Requirement: Contenido de la imagen

La imagen SHALL construirse desde la imagen oficial de Nginx, SHALL servir exclusivamente el contenido de `public/` y SHALL declarar el puerto 80.

#### Scenario: Build exitoso

- **WHEN** se ejecuta `docker build -t libreria-frontend .` en `frontend/`
- **THEN** la imagen se construye sin errores y el contenedor sirve `index.html` en el puerto 80

#### Scenario: Archivos fuera de public

- **WHEN** el repositorio contiene tests, el servidor de desarrollo o el `Dockerfile`
- **THEN** ninguno de esos archivos queda accesible desde el navegador

#### Scenario: Sin secretos en la imagen

- **WHEN** se inspecciona la imagen
- **THEN** no contiene archivos `.env` ni credenciales

### Requirement: Proxy de la API

La configuración de Nginx SHALL reenviar `/api/` a `http://${API_UPSTREAM}/` y SHALL tomar el destino de una variable de entorno sustituida al iniciar el contenedor.

#### Scenario: Reescritura del prefijo

- **WHEN** el navegador solicita `/api/libros/`
- **THEN** el backend recibe `/libros/`

#### Scenario: Variable configurada

- **WHEN** el contenedor arranca con `API_UPSTREAM=backend:8000`
- **THEN** la plantilla se sustituye y el proxy apunta a `http://backend:8000/`

#### Scenario: Variable ausente

- **WHEN** el contenedor arranca sin `API_UPSTREAM`
- **THEN** la configuración de Nginx queda inválida y el contenedor no publica el sitio; el motivo se lee en los logs del servicio

### Requirement: Rutas estáticas

La configuración SHALL servir `index.html` como índice y SHALL devolver 404 para archivos inexistentes, sin reescribir rutas de la API hacia el índice.

#### Scenario: Archivo inexistente

- **WHEN** se solicita `/no-existe.html`
- **THEN** Nginx responde 404

#### Scenario: Raíz del sitio

- **WHEN** se solicita `/`
- **THEN** se entrega `index.html`

### Requirement: Servidor de desarrollo equivalente

El repositorio SHALL incluir un servidor de desarrollo sin dependencias que sirva `public/` y reenvíe `/api/*` al backend, para verificar el contrato relativo sin Docker.

#### Scenario: Proxy local

- **WHEN** se ejecuta el servidor de desarrollo con el backend disponible
- **THEN** `/api/health/ready` responde 200 a través del servidor local

#### Scenario: Backend no disponible

- **WHEN** el backend no responde
- **THEN** el servidor local informa un error de conexión con la API y sigue sirviendo los archivos estáticos

#### Scenario: Sin dependencias externas

- **WHEN** se ejecuta el servidor de desarrollo en una máquina con Python
- **THEN** funciona sin instalar paquetes
