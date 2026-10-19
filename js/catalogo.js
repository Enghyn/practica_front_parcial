// Catálogo de la Librería Aurora (Ejercicio 3).
// Renderiza #lista-catalogo desde window.LibreriaDatos y filtra por título.
(function () {
  'use strict';

  var datos = window.LibreriaDatos;

  // Mapas id -> nombre para resolver referencias sin búsquedas repetidas.
  var editorialesPorId = new Map(datos.editoriales.map(function (e) { return [e.id, e.nombre]; }));
  var generosPorId = new Map(datos.generos.map(function (g) { return [g.id, g.nombre]; }));
  var autoresPorId = new Map(datos.autores.map(function (a) { return [a.id, a.nombre]; }));

  var lista = document.getElementById('lista-catalogo');
  var formulario = document.getElementById('formulario-busqueda');
  var campoBusqueda = document.getElementById('busqueda-titulo');
  var mensajeVacio = document.getElementById('mensaje-catalogo-vacio');
  var mensajeSinResultados = document.getElementById('mensaje-sin-resultados');

  // Crea un párrafo "Etiqueta: valor" usando solo texto (evita XSS).
  function crearLinea(etiqueta, valor) {
    var p = document.createElement('p');
    var fuerte = document.createElement('strong');
    fuerte.textContent = etiqueta + ': ';
    p.appendChild(fuerte);
    p.appendChild(document.createTextNode(valor));
    return p;
  }

  // Una tarjeta por libro con los seis datos: título, ISBN, editorial,
  // género (o "Sin clasificar"), autores y precio con dos decimales.
  function crearTarjeta(libro) {
    var item = document.createElement('li');
    item.className = 'tarjeta';

    var titulo = document.createElement('h3');
    titulo.className = 'tarjeta__titulo';
    titulo.textContent = libro.titulo;
    item.appendChild(titulo);

    item.appendChild(crearLinea('ISBN', libro.isbn));
    item.appendChild(crearLinea('Editorial', editorialesPorId.get(libro.editorialId) || 'Desconocida'));
    item.appendChild(crearLinea('Género', libro.generoId ? (generosPorId.get(libro.generoId) || 'Sin clasificar') : 'Sin clasificar'));

    var nombresAutores = libro.autorIds
      .map(function (id) { return autoresPorId.get(id); })
      .filter(Boolean)
      .join(', ');
    item.appendChild(crearLinea('Autores', nombresAutores || 'Desconocido'));

    // Precio numérico, formateado solo al mostrar.
    item.appendChild(crearLinea('Precio', '$ ' + Number(libro.precio).toFixed(2)));

    return item;
  }

  // Vacía la lista y dibuja una tarjeta por libro de la colección dada.
  function renderizarCatalogo(libros) {
    lista.replaceChildren();
    libros.forEach(function (libro) {
      lista.appendChild(crearTarjeta(libro));
    });
  }

  // Alterna los mensajes con el atributo hidden:
  // - catálogo vacío: visible solo si no hay libros en total.
  // - sin resultados: visible solo si hay libros pero el filtro no coincide.
  function actualizarMensajes(visibles, total) {
    var catalogoVacio = total === 0;
    var sinResultados = total > 0 && visibles === 0;
    mensajeVacio.hidden = !catalogoVacio;
    mensajeSinResultados.hidden = !sinResultados;
    lista.hidden = visibles === 0;
  }

  // Filtro puro: trim + minúsculas + subcadena. Vacío = todo el catálogo.
  function filtrarPorTitulo(libros, criterio) {
    var texto = String(criterio == null ? '' : criterio).trim().toLowerCase();
    if (texto === '') {
      return libros.slice();
    }
    return libros.filter(function (libro) {
      return libro.titulo.toLowerCase().includes(texto);
    });
  }

  function aplicarFiltro() {
    editorialesPorId = new Map(datos.editoriales.map(function (e) { return [e.id, e.nombre]; }));
    generosPorId = new Map(datos.generos.map(function (g) { return [g.id, g.nombre]; }));
    autoresPorId = new Map(datos.autores.map(function (a) { return [a.id, a.nombre]; }));

    var filtrados = filtrarPorTitulo(datos.libros, campoBusqueda.value);
    renderizarCatalogo(filtrados);
    actualizarMensajes(filtrados.length, datos.libros.length);
  }

  // Escuchar actualizaciones de datos locales
  document.addEventListener('libreria:datos-actualizados', function () {
    aplicarFiltro();
  });

  // Submit: filtra sin recargar la página.
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    aplicarFiltro();
  });

  // Reset (botón "Limpiar búsqueda"): restaura la vista completa.
  formulario.addEventListener('reset', function () {
    // El reset limpia el campo de forma asíncrona; se renderiza después.
    window.requestAnimationFrame(function () {
      renderizarCatalogo(datos.libros);
      actualizarMensajes(datos.libros.length, datos.libros.length);
    });
  });

  // Búsqueda en vivo opcional: actualiza mientras se escribe.
  campoBusqueda.addEventListener('input', aplicarFiltro);

  // Render inicial: catálogo completo.
  renderizarCatalogo(datos.libros);
  actualizarMensajes(datos.libros.length, datos.libros.length);
})();
