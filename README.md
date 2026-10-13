# Librería Aurora — Etapa 1 (estructura HTML)

TPI de Programación III — Frontend de una librería.
Consigna oficial: `docs/Repaso Primer Parcial.pdf`.

---

## 1. Quiénes realizan el trabajo

> - (Integrante 1 — Nombre y apellido — Legajo)
> - (Integrante 2 — Nombre y apellido — Legajo)

*(Completar antes de la entrega.)*

## 2. Cómo abrir el proyecto

1. Abrí la carpeta del proyecto en el explorador de archivos.
2. Hacé **doble clic en `index.html`**.
3. Listo: se abre en el navegador.

No hace falta instalar nada. No hay `package.json`, ni `node_modules`, ni servidor, ni conexión a
internet: el proyecto se abre directamente con el protocolo `file://` y **no realiza ninguna petición
de red**.

## 3. Qué contiene esta entrega

El proyecto contiene **un solo archivo: `index.html`**. No hay carpetas `css/` ni `js/`, porque esta
etapa no incluye estilos ni comportamientos.

`index.html` incluye:

- Las **cinco vistas** del Ejercicio 1: Catálogo, Libros, Clientes, Ventas e Historial.
- Navegación por anclas dentro de un único documento, más un enlace de salto al contenido.
- HTML semántico: `<header>`, `<nav>`, `<main>`, cinco `<section>` y `<footer>`.
- Todos los formularios con sus campos, cada uno con su `<label for>` asociado, y botones con texto
  que describe la acción.
- Las cinco tablas con `<caption>` y `<thead>` completo; los `<tbody>` están **vacíos**.
- Los contenedores de mensaje para los estados que la consigna exige comunicar: lista vacía,
  búsqueda sin resultados y operación correcta o rechazada.
- Comentarios `<!-- ENGANCHE ETAPA 2: … -->` que señalan en el código dónde se enganchará el
  comportamiento, y un bloque `<noscript>` con el aviso para quien abra el proyecto sin JavaScript.

## 4. Qué pantallas son estructura y qué interacciones funcionan

Según `AGENTS.md` §9.2.9 y §9.3, se declara expresamente el estado real de la entrega:

| Elemento | Estado |
|---|---|
| Las 5 pantallas (Catálogo, Libros, Clientes, Ventas, Historial) | **Estructura / maqueta**: están construidas con sus campos, tablas y mensajes, pero vacías. |
| Navegación por anclas y enlace de salto | **Funciona** (es HTML puro, no necesita JavaScript). |
| Formularios de alta de libros y clientes | **No funciona**: no hay JavaScript, al enviarlos el navegador los valida de forma nativa y recarga la página. |
| Composición y confirmación de la venta | **No funciona**. |
| Historial de ventas y detalle | **No funciona**. |
| Filtro por título del catálogo | **No funciona**: el campo existe, pero no filtra nada. |

**En esta etapa no hay ni una sola interacción implementada.** No se ejecutó ningún caso manual de
la §10 de la consigna, porque todos requieren comportamiento.

## 5. Lo que todavía no funciona (pendiente de la etapa 2)

- Cargar los **datos iniciales**: en esta etapa **no hay datos**. El modelo de datos en arrays con
  identificadores estables y la siembra mínima (6 libros, 2 editoriales, 2 géneros, 3 autores,
  3 clientes) los define la etapa 2.
- **Renderizar** el catálogo y los listados desde JavaScript.
- **Filtro por título** del catálogo.
- **Altas** de libros y de clientes, con sus validaciones.
- **Venta simulada** con renglones y totales.
- **Historial** con detalle y precio unitario histórico.
- **Persistencia** con `localStorage`.
- **Estilos**: no hay CSS en esta etapa.

## 6. Alcance técnico

HTML, CSS y JavaScript nativos únicamente. En esta etapa no hay CSS ni JavaScript: no se usan
librerías, frameworks, CDN, herramientas de compilación, backend ni llamadas `fetch`.

## 7. Estructura del proyecto

```
index.html            ← punto de entrada (único archivo de la aplicación)
README.md             ← este archivo
AGENTS.md             ← reglas del proyecto
docs/                 ← consigna oficial en PDF
openspec/             ← especificación del cambio de etapa 1
```

No hay imágenes propias ni de terceros, así que no hay procedencia que acreditar.