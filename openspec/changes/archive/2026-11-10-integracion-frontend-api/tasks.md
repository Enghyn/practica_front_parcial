# Tasks

## 1. Preparación del repositorio unificado

- [x] 1.1 Crear `libreria-global/` con `frontend/` y `backend/`
- [x] 1.2 Copiar `prog_segundo_parcial/despliegue/` a `backend/` y verificar identidad por hash
- [x] 1.3 Mover la web del frontend a `frontend/public/` conservando rutas relativas
- [x] 1.4 Inicializar OpenSpec y registrar este change

## 2. Capa de datos (TDD)

- [x] 2.1 Escribir pruebas de `nucleo.js` para construcción de consultas (vacío, acentos, límites)
- [x] 2.2 Implementar `js/config.js` con la URL base `/api` en un único lugar
- [x] 2.3 Implementar `js/nucleo.js`: consulta, aritmética de paginación, normalización de importes e identificadores
- [x] 2.4 Escribir pruebas de traducción de errores (409 texto, 422 lista, 422 texto, 404, 500, red)
- [x] 2.5 Implementar `js/api.js` con `fetch`, tiempo de espera y errores tipados
- [x] 2.6 Implementar `js/formato.js` (importes y fechas)
- [x] 2.7 Implementar `js/estado.js` con cachés de sesión (editoriales, géneros, clientes, autores, autores por libro)
- [x] 2.8 Ejecutar `node --test` y dejar la suite en verde

## 3. Estructura y estilos

- [x] 3.1 Actualizar `index.html`: scripts nuevos con `defer`, estados de carga y error, paginadores
- [x] 3.2 Agregar campo `stock` al formulario de libros
- [x] 3.3 Reemplazar el selector múltiple de autores por el bloque de autorías (ID, rol, orden)
- [x] 3.4 Agregar búsqueda de cliente por ID y columna de identificador
- [x] 3.5 Agregar búsqueda de libro por título en el formulario de venta
- [x] 3.6 Actualizar textos de `noscript`, pie y descripciones que mencionan `localStorage`
- [x] 3.7 Agregar estilos de paginación, autorías y estados; asegurar `[hidden]` efectivo

## 4. Catálogo

- [x] 4.1 Consultar `GET /libros/` con `limit`, `offset` y `titulo`, y reiniciar `offset` al filtrar
- [x] 4.2 Renderizar tarjetas con título, ISBN, precio, editorial y género, con «Sin clasificar»
- [x] 4.3 Implementar «Ver autores» con `GET /libros/{id}` y caché de sesión
- [x] 4.4 Implementar paginador anterior/siguiente por `recibidos === limit`
- [x] 4.5 Implementar los cuatro estados y el reintento ante error

## 5. Altas

- [x] 5.1 Cargar editoriales y géneros desde la API y poblar los selectores
- [x] 5.2 Implementar el alta de libro con el cuerpo exacto de `POST /libros/`
- [x] 5.3 Implementar la verificación de autores por `GET /autores/{id}` y la tabla de autorías
- [x] 5.4 Validar precio, stock, editorial y al menos una autoría antes de enviar
- [x] 5.5 Mostrar 201 con el registro devuelto, 409 y 422 con el mensaje del servidor
- [x] 5.6 Implementar el alta de cliente y la búsqueda por `GET /clientes/{id}`
- [x] 5.7 Refrescar catálogo, tabla de libros y opciones de venta tras cada alta

## 6. Ventas e historial

- [x] 6.1 Implementar el borrador de venta, el alta y la edición de renglones y el total
- [x] 6.2 Rechazar libros repetidos y cantidades no enteras o no positivas
- [x] 6.3 Confirmar con `POST /ventas/` enviando solo `cliente_id` y `renglones`
- [x] 6.4 Deshabilitar el botón durante el envío y usar total y renglones de la respuesta
- [x] 6.5 Conservar el borrador ante 409, 422 y error de conexión
- [x] 6.6 Implementar el historial paginado con `GET /ventas/`
- [x] 6.7 Implementar el detalle con `GET /ventas/{id}` e importes históricos
- [x] 6.8 Refrescar el historial tras confirmar una venta

## 7. Documentación del frontend

- [x] 7.1 Reescribir `frontend/README.md` con el alcance nuevo, cómo ejecutar localmente y los casos manuales
- [x] 7.2 Reescribir `frontend/AGENTS.md` sin las reglas «sin backend» y «sin fetch»
- [x] 7.3 Documentar la decisión de autores y clientes por identificador

## 8. Verificación local

- [x] 8.1 Levantar el backend local con su base y datos de prueba
- [x] 8.2 Ejecutar `frontend/dev_server.py` y verificar que `/api/health/ready` responde 200
- [x] 8.3 Recorrer catálogo, alta de libro, alta de cliente, venta e historial contra la API local
- [x] 8.4 Verificar 409 y 422 en los formularios y la conservación del borrador
- [x] 8.5 Verificar la persistencia recargando la página y reabriendo el detalle
