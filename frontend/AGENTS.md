# Reglas del frontend

Estas reglas reemplazan las del parcial anterior, que declaraban «sin backend», «sin `fetch`» y
persistencia en `localStorage`. Esta aplicación **requiere** la API.

## Alcance

El frontend consume la API del TP de los capítulos 1 a 4. No implementa autenticación, roles, stock
transaccional ni panel de administración: eso pertenece al backend de los capítulos 1 a 6 y está
fuera de alcance.

## Reglas duras

1. **Sin dependencias de ejecución.** Nada de frameworks, bundlers, CDN ni paquetes npm en
   `public/`. Sólo HTML, CSS y JavaScript nativo.
2. **Sin persistencia en el navegador.** Prohibido `localStorage` y `sessionStorage`. La fuente de
   verdad es la API; las cachés de la sesión viven en memoria (`estado.js`).
3. **Sin datos semilla.** No se declaran libros, clientes, autores ni ventas en el código. Todo
   proviene de la API.
4. **Una sola URL base.** Está en `public/js/config.js` (`/api`). Ninguna vista arma rutas absolutas
   ni conoce el host del backend.
5. **Toda petición pasa por `api.js`.** Las vistas no llaman a `fetch` directamente ni interpretan
   códigos de estado: reciben `{ datos, estado }` o un `ErrorApi` con el mensaje ya traducido.
6. **La lógica pura vive en `nucleo.js`** y tiene pruebas en `tests/`. Si agregás una función pura,
   agregá su prueba.
7. **Nada de `innerHTML` con datos de la API.** Se construye con `createElement` y `textContent`.
8. **Los ids del HTML son contrato.** Si una vista necesita un elemento nuevo, se agrega al
   `index.html` y se documenta; no se genera HTML dinámico con estructura compleja.
9. **Los mensajes distinguen estados.** Carga, vacío, sin coincidencias y error de conexión no se
   comparten. Un error nunca se muestra como «no hay datos».
10. **La API manda sobre los importes.** El total de una venta y los precios unitarios del detalle se
    muestran tal como los devuelve el servidor; el cálculo local es sólo un borrador.
11. **Un solo envío por formulario.** Deshabilitá el botón mientras la petición está en curso y
    conservá los valores ante un rechazo.
12. **Castellano rioplatense neutro** en la interfaz y en los comentarios.

## Verificación antes de dar por terminado un cambio

```powershell
cd frontend
node --check public/js/<archivo>.js
npm test
python dev_server.py     # y probar el flujo afectado en el navegador
```

Los casos funcionales de referencia son G-01 a G-07 del enunciado, registrados en `../evidencia/`.
