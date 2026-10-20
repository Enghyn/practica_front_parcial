# Design

## Context

La vista de Ventas y la de Historial ya existen en `index.html` con la estructura preparada por la Etapa 1 (puntos de enganche de `puntos-de-enganche-libreria`): formularios, tablas con `<thead>` y `<tbody>` vacíos, contenedores de mensaje y selectores de cliente/libro sin opciones. El catálogo, el alta de libros y el alta de clientes ya funcionan en `js/catalogo.js` y `js/altas.js`, y `js/datos.js` expone `window.LibreriaDatos`. Este diseño describe cómo se implementa el Ejercicio 5 sobre esa base, con HTML, CSS y JavaScript nativos (sin librerías ni backend), respetando la regla crítica §8.4: el precio unitario se **copia** al confirmar y el historial **nunca** relee el catálogo.

## Goals / Non-Goals

**Goals:**

- Componer una venta en curso (cliente + renglones), validarla al confirmar y registrarla en `datos.ventas`.
- Copiar título y precio unitario del catálogo al renglón guardado en el momento de la confirmación (historial inmutable).
- Mostrar el historial y su detalle sin editar ni eliminar ventas confirmadas.
- Actualizar listados y mensajes sin recargar la página, con `textContent` para todo dato de usuario (evitar XSS).

**Non-Goals:**

- Gestión de stock, cobros, facturación fiscal o descuentos.
- Editar o eliminar ventas ya confirmadas (prohibido por la consigna §8.5).
- Persistencia en `localStorage` (pertenece al Ejercicio 6; este cambio solo mantiene el array en memoria).
- Administración de editoriales, géneros ni autores (fuera de alcance §6.6).

## Decisions

1. **Archivo nuevo `js/ventas.js` con IIFE y `'use strict'`**, siguiendo el patrón de `catalogo.js` y `altas.js`: nada de variables globales; solo se lee `window.LibreriaDatos`.
   - *Alternativa*: meter el código en `altas.js`. Descartada: cada vista con responsabilidades propias separadas mantiene el código legible (§11).

2. **Renglones en curso como array `renglonesEnCurso` de `{ libroId, cantidadTexto }`** — sin precio ni título todavía. El precio y el título se copian del catálogo recién en `confirmarVenta`, al construir `renglonesGuardados`. Esto hace que la copia histórica sea literal y verificable (§8.4): los renglones en curso viven del catálogo; los guardados son autosuficientes.
   - *Alternativa*: copiar precio al agregar el renglón. Descartada: si el usuario demora en confirmar, se registraría un precio que no era el vigente al confirmar.

3. **Libro repetido → se informa y no se agrega** (decisión informada al usuario). `agregarRenglon()` rechaza con mensaje que sugiere modificar la cantidad en la fila existente.
   - *Alternativa*: sumar cantidades automáticamente. Descartada: el usuario debe notar la operación; la consigna §8.1 admite ambas variantes.

4. **Edición de cantidades por `<input type="number">` dentro de la propia fila** + botón "Quitar renglón" en una columna "Acciones". El evento `input` delegado en `<tbody>` actualiza el subtotal de esa fila y el total **sin re-render completo**, para no perder el foco mientras se escribe.

5. **Venta confirmada como objeto autosuficiente**: `{ id, fecha (ISO), clienteId, cliente: {id, nombre, email} (copia), renglones: [{libroId, titulo, cantidad, precioUnitario (copia), subtotal}], total }`. `verDetalle()` lee **solo** `datos.ventas`; no hay ninguna referencia a `datos.libros` en el render del historial (§13.5). Ids secuenciales `venta-1, venta-2, …`.

6. **Importes siempre con `'$ ' + Number(valor).toFixed(2)`** (§8.2) y fecha ISO guardada, mostrada con `toLocaleString('es-AR')`.

7. **Seguridad**: toda celda y mensaje se construye con `textContent` (`crearTd`, `mostrarMensaje`); jamás se concatena HTML con datos de usuario (§13.2). Reutilizan las clases existentes (`tabla`, `boton`, `mensaje`, `campo__control`); solo se agrega `.tabla__cantidad` para el ancho del input en celda.

8. **Sincronización con altas**: `ventas.js` escucha `libreria:datos-actualizados` y re-renderiza los renglones en curso para refrescar títulos/precios si el catálogo cambia; las ventas ya guardadas no se tocan.

## Risks / Trade-offs

- [La cantidad inválida en una fila bloquea el total y la confirmación] → es intencional (§8.3): el total muestra `—` y el confirmar informa el número de renglón con el problema; el input se marca con `aria-invalid`.
- [Si el catálogo se vaciara a mano, un renglón en curso referencia un libro inexistente] → `renderizarRenglones` muestra "Libro no disponible" y `confirmarVenta` lo rechaza con mensaje; en la práctica no ocurre porque el catálogo solo crece por altas.
- [El id `venta-N` se basa en `datos.ventas.length + 1`] → colisiona si se borrara una venta del medio; como el historial no permite eliminar (§8.5), no hay colisión en el flujo soportado.
- [Sin `localStorage` las ventas se pierden al recargar] → documentado como pendiente del Ejercicio 6 en el README; fuera del alcance de este cambio.
