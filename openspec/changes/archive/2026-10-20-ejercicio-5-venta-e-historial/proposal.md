# Proposal

## Why

El TPI de la librería (consigna §8, Ejercicio 5) exige una venta simulada con renglones, cálculos y un historial cuyo precio unitario sea inmutable al confirmarse; hasta ahora las vistas Ventas e Historial solo tenían la estructura HTML preparada y el proyecto no podía registrar ninguna venta.

## What Changes

- Nuevo comportamiento de **venta en curso**: selección de cliente, renglones con libro y cantidad entera mayor que cero, edición de cantidades y quitado de renglones antes de confirmar, subtotales y total con dos decimales.
- **Sin libros repetidos** dentro de la misma venta: el duplicado se informa y no crea un segundo renglón.
- **Validaciones al confirmar**: no se registra una venta sin cliente, sin renglones o con cantidades inválidas; cada rechazo informa el motivo con texto.
- **Confirmación con copia histórica**: al confirmar se copian al renglón el título y el precio unitario del catálogo; la venta registrada guarda id, fecha, cliente (copiado), renglones y total.
- **Historial inmutable**: el listado muestra id, fecha, cliente y total; el detalle se arma únicamente con los datos guardados en la venta y jamás relee el precio del catálogo. Las ventas no se editan ni eliminan.
- `js/datos.js` expone el array `ventas`; el aviso de estado del `index.html` y el README reflejan que el Ejercicio 5 está operativo y que el pendiente es el Ejercicio 6.

## Capabilities

### New Capabilities

- `venta-simulada`: composición y confirmación de una venta con renglones, cálculos con dos decimales, validaciones de confirmación, registro con copia del precio unitario y historial cuyo detalle es inmutable frente a cambios posteriores del catálogo.

### Modified Capabilities

_(ninguna: los requisitos de las capacidades existentes no cambian; solo se actualizan textos de estado del documento y del README para cumplir el requisito de honestidad ya vigente.)_

## Impact

- **Código**: `js/ventas.js` (nuevo), `js/datos.js` (array `ventas`), `index.html` (columna "Acciones" en la tabla de renglones, `colspan` del total, textos de estado, script nuevo), `css/estilos.css` (clase menor para el input de cantidad en celda).
- **Documentación**: `README.md` (estado de pantallas y casos manuales 4 y 5 de la §10).
- **Sin dependencias nuevas**: se mantiene HTML, CSS y JavaScript nativos; no hay librerías, CDNs ni backend.
