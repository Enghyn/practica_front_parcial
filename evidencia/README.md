# Evidencia

Capturas y registros de los casos G-01 a G-07 del enunciado. Todos los datos usados son ficticios.

| Caso | Registro | Capturas |
|---|---|---|
| G-01 · Catálogo | [`G-01.md`](G-01.md) | `G-01-catalogo-1440.png`, `G-01-catalogo-390.png` |
| G-02 · Alta de libro | [`G-02.md`](G-02.md) | `G-02-409-isbn.png` |
| G-03 · Alta de cliente | [`G-03.md`](G-03.md) | `G-03-cliente-por-id.png` |
| G-04 · Venta | [`G-04.md`](G-04.md) | `G-04-detalle-venta.png` |
| G-05 · Precio histórico | [`G-05.md`](G-05.md) | `G-05-catalogo-precio-nuevo.png`, `G-05-venta-importes-historicos.png` |
| G-06 · Rechazos | [`G-06.md`](G-06.md) | — |
| G-07 · Despliegue | [`G-07.md`](G-07.md) | _(pendiente)_ |

## Cómo se generó

Las capturas se tomaron con Playwright sobre el frontend servido por `frontend/dev_server.py`, que
sirve `public/` y reenvía `/api/*` a la API desplegada. Ese servidor replica la regla de Nginx, así
que el contrato relativo `/api` es el mismo que en producción.

## Datos ficticios identificables

| Dato | Valor |
|---|---|
| ISBN del libro de prueba | `978-GLOBAL-0001-X` |
| Email del cliente de prueba | `cliente.global@ejemplo.com` |
| Venta de prueba | identificador 5, total `77000.00` |

No se incluyen contraseñas, tokens ni cadenas de conexión en las capturas.
