# Tasks

## 1. Datos y estructura

- [x]1.1 Exponer `ventas: []` en `window.LibreriaDatos` (`js/datos.js`) y verificar que `datos.ventas` existe en consola con el array vacío.
- [x]1.2 Agregar la columna "Acciones" a la tabla de renglones (`index.html`), ajustar el `colspan` del total a 4 y verificar que la tabla conserva `<thead>` completo y `<tbody>` vacío.

## 2. Venta en curso

- [x]2.1 Implementar `js/ventas.js` con `agregarRenglon` (libro requerido, cantidad entera > 0, sin libro repetido) y verificar que un duplicado muestra mensaje de texto y no crea un segundo renglón.
- [x]2.2 Implementar `renderizarRenglones` con celdas por `textContent`, input de cantidad en la fila, botón "Quitar renglón" y subtotal/total en vivo; verificar que cambiar la cantidad recalcula subtotal y total sin recargar.
- [x]2.3 Verificar que los importes se muestran con dos decimales (`formatearImporte`) y que el total se oculta con `—` si hay cantidades inválidas.

## 3. Confirmación e historial inmutable

- [x]3.1 Implementar `confirmarVenta` con `preventDefault`, validaciones (cliente, al menos un renglón, cantidades válidas) y mensaje de rechazo por cada caso; verificar que no se registra ninguna venta cuando falta un requisito.
- [x]3.2 Verificar que al confirmar una venta válida se copian título y precio unitario del catálogo a los renglones guardados, se registra id/fecha/cliente/renglones/total y el formulario queda limpio con mensaje de éxito.
- [x]3.3 Implementar `renderizarHistorial` y `verDetalle` leyendo solo `datos.ventas`; verificar el caso §10.6: cambiar el precio del libro en el catálogo después de confirmar y comprobar que el detalle conserva el precio unitario, subtotales y total históricos.
- [x]3.4 Verificar que el historial no expone controles de edición ni eliminación de ventas confirmadas.

## 4. Integración, documentación y pruebas

- [x]4.1 Ejecutar los casos manuales §10.4 y §10.5 con el navegador (script CDP `test-ej5.mjs`) y registrar los resultados reales en el README (§8); verificar que las tablas de estado del README marcan Ventas e Historial como funcionando y el Ejercicio 6 como pendiente.
- [x]4.2 Verificar accesibilidad básica: foco visible al recorrer el formulario de venta con teclado, errores expresados con texto y mensajes de listas vacías.

## Workflow follow-up

- Archivar el cambio con `openspec archive` cuando la revisión del proyecto lo apruebe.
