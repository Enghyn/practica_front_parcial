// Catálogo paginado contra la API: búsqueda por título, tarjetas y autorías.
(function () {
  'use strict';

  var Nucleo = window.LibreriaNucleo;
  var Estado = window.LibreriaEstado;
  var Formato = window.LibreriaFormato;

  // Elementos de la vista (todos los ids existen en index.html).
  var formulario = document.getElementById('formulario-busqueda');
  var campoBusqueda = document.getElementById('busqueda-titulo');
  var lista = document.getElementById('lista-catalogo');
  var paginacion = document.getElementById('paginacion-catalogo');
  var botonAnterior = document.getElementById('boton-pagina-anterior');
  var botonSiguiente = document.getElementById('boton-pagina-siguiente');
  var resumenPaginacion = document.getElementById('resumen-paginacion');
  var mensajeCargando = document.getElementById('mensaje-catalogo-cargando');
  var mensajeError = document.getElementById('mensaje-catalogo-error');
  var textoError = document.getElementById('texto-error-catalogo');
  var mensajeVacio = document.getElementById('mensaje-catalogo-vacio');
  var mensajeSinResultados = document.getElementById('mensaje-sin-resultados');
  var botonReintentar = document.getElementById('boton-reintentar-catalogo');

  var limite = Nucleo
    ? Nucleo.ajustarLimite(window.LIBRERIA_CONFIG && window.LIBRERIA_CONFIG.LIMITE)
    : 20;
  var offset = 0;
  var titulo = '';
  var generacion = 0;
  var solicitudesPropias = 0;
  var temporizador = null;
  var iniciado = false;

  function mostrar(elemento) {
    if (elemento) elemento.hidden = false;
  }

  function ocultar(elemento) {
    if (elemento) elemento.hidden = true;
  }

  function textoDeError(error) {
    return error && typeof error.message === 'string' && error.message !== ''
      ? error.message
      : 'No se pudo cargar el catálogo.';
  }

  // Estado visual mientras se consulta la API.
  function marcarCargando() {
    mostrar(mensajeCargando);
    ocultar(mensajeError);
    ocultar(mensajeVacio);
    ocultar(mensajeSinResultados);
    if (lista) lista.setAttribute('aria-busy', 'true');
  }

  function terminarCarga() {
    ocultar(mensajeCargando);
    if (lista) lista.setAttribute('aria-busy', 'false');
  }

  function cancelarDebounce() {
    if (temporizador !== null) {
      clearTimeout(temporizador);
      temporizador = null;
    }
  }

  // Párrafo "Etiqueta: valor" armado solo con nodos de texto.
  function crearLinea(etiqueta, valor) {
    var parrafo = document.createElement('p');
    var fuerte = document.createElement('strong');
    fuerte.textContent = etiqueta + ':';
    parrafo.appendChild(fuerte);

    var texto = valor === null || valor === undefined || valor === '' ? '—' : String(valor);
    parrafo.appendChild(document.createTextNode(' ' + texto));
    return parrafo;
  }

  function crearTarjeta(libro) {
    var item = document.createElement('li');
    item.className = 'tarjeta';

    var encabezado = document.createElement('h3');
    encabezado.className = 'tarjeta__titulo';
    encabezado.textContent = libro.titulo;
    item.appendChild(encabezado);

    item.appendChild(crearLinea('ISBN', libro.isbn));
    item.appendChild(crearLinea('Precio', Formato.formatearImporte(libro.precioNumero)));
    item.appendChild(crearLinea('Editorial', libro.editorialNombre));
    item.appendChild(crearLinea('Género', libro.generoNombre));
    item.appendChild(crearLinea('Stock', libro.stockNumero));

    var pie = document.createElement('div');
    pie.className = 'tarjeta__pie';

    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton boton--secundario';
    boton.textContent = 'Ver autores';
    boton.dataset.libroId = Nucleo.normalizarId(libro.id);
    boton.setAttribute('aria-expanded', 'false');
    pie.appendChild(boton);
    item.appendChild(pie);

    var contenedorAutores = document.createElement('div');
    contenedorAutores.className = 'tarjeta__autores';
    contenedorAutores.hidden = true;
    item.appendChild(contenedorAutores);

    return item;
  }

  function renderizarAutores(contenedor, autorias) {
    contenedor.replaceChildren();

    if (!Array.isArray(autorias) || autorias.length === 0) {
      var vacio = document.createElement('p');
      vacio.textContent = 'Sin autores registrados';
      contenedor.appendChild(vacio);
      return;
    }

    var listaAutores = document.createElement('ul');
    autorias.forEach(function (autoria) {
      var elemento = document.createElement('li');
      var nombre = autoria.nombre || ('Autor ' + autoria.autorId);
      elemento.textContent = nombre + ' — ' + autoria.rol;
      listaAutores.appendChild(elemento);
    });
    contenedor.appendChild(listaAutores);
  }

  // Primera consulta: verifica en la API; después solo alterna la visibilidad.
  async function alternarAutores(boton) {
    var tarjeta = boton.closest ? boton.closest('.tarjeta') : null;
    var contenedor = tarjeta ? tarjeta.querySelector('.tarjeta__autores') : null;
    if (!contenedor) return;

    if (contenedor.dataset.cargado === '1') {
      contenedor.hidden = !contenedor.hidden;
      boton.setAttribute('aria-expanded', contenedor.hidden ? 'false' : 'true');
      return;
    }

    var id = Nucleo.normalizarId(boton.dataset.libroId);
    if (id === '') return;

    boton.disabled = true;
    contenedor.hidden = false;
    boton.setAttribute('aria-expanded', 'true');
    contenedor.replaceChildren();

    var espera = document.createElement('p');
    espera.textContent = 'Cargando autores…';
    contenedor.appendChild(espera);

    try {
      var autorias = await Estado.cargarAutoresDeLibro(id);
      renderizarAutores(contenedor, autorias);
      contenedor.dataset.cargado = '1';
    } catch (error) {
      contenedor.replaceChildren();
      var fallo = document.createElement('p');
      fallo.textContent = textoDeError(error);
      contenedor.appendChild(fallo);
    } finally {
      boton.disabled = false;
    }
  }

  function renderizarResultados(detalle) {
    if (!lista) return;

    var libros = Array.isArray(detalle.libros) ? detalle.libros : [];
    lista.replaceChildren();
    libros.forEach(function (libro) {
      lista.appendChild(crearTarjeta(libro));
    });

    var pag = Nucleo.calcularPaginacion({
      offset: detalle.offset,
      limit: detalle.limite,
      recibidos: libros.length
    });

    if (botonAnterior) botonAnterior.disabled = !pag.anterior;
    if (botonSiguiente) botonSiguiente.disabled = !pag.siguiente;

    // El paginador también se muestra cuando se retrocede desde una página vacía.
    if (paginacion) paginacion.hidden = !(libros.length > 0 || pag.anterior);

    if (resumenPaginacion) {
      if (libros.length > 0) {
        var resumen = 'Mostrando ' + pag.desde + '–' + pag.hasta;
        if (detalle.titulo) resumen += ' para «' + detalle.titulo + '»';
        resumenPaginacion.textContent = resumen;
      } else {
        resumenPaginacion.textContent = 'Sin resultados';
      }
    }

    if (libros.length === 0 && !detalle.titulo) {
      mostrar(mensajeVacio);
      ocultar(mensajeSinResultados);
      lista.hidden = true;
    } else if (libros.length === 0) {
      ocultar(mensajeVacio);
      mostrar(mensajeSinResultados);
      lista.hidden = true;
    } else {
      ocultar(mensajeVacio);
      ocultar(mensajeSinResultados);
      lista.hidden = false;
    }
  }

  async function recargar() {
    if (!Nucleo || !Estado || !Formato || typeof Estado.cargarCatalogo !== 'function') {
      mostrar(mensajeError);
      if (textoError) textoError.textContent = 'El catálogo no está disponible.';
      return;
    }

    var miGeneracion = generacion + 1;
    generacion = miGeneracion;
    solicitudesPropias += 1;
    marcarCargando();

    try {
      var detalle = await Estado.cargarCatalogo({ offset: offset, titulo: titulo });

      // Una respuesta vieja no puede pisar a la búsqueda más reciente.
      if (miGeneracion !== generacion) return;

      offset = Nucleo.ajustarOffset(detalle.offset);
      titulo = typeof detalle.titulo === 'string' ? detalle.titulo : titulo;
      limite = Nucleo.ajustarLimite(detalle.limite);

      terminarCarga();
      ocultar(mensajeError);
      renderizarResultados(detalle);
    } catch (error) {
      if (miGeneracion !== generacion) return;

      terminarCarga();
      mostrar(mensajeError);
      ocultar(mensajeVacio);
      ocultar(mensajeSinResultados);
      if (textoError) textoError.textContent = textoDeError(error);
    } finally {
      solicitudesPropias -= 1;
    }
  }

  // Si otro módulo recarga el catálogo (por ejemplo, tras un alta), se adopta
  // esa página para que la vista muestre lo mismo que el estado compartido.
  function adoptarCatalogoExterno(evento) {
    // Los eventos de cargas propias los renderiza cada recargar() al resolver.
    if (solicitudesPropias > 0) return;

    var detalle = evento && evento.detail;
    if (!detalle || !Array.isArray(detalle.libros)) return;

    offset = Nucleo.ajustarOffset(detalle.offset);
    titulo = typeof detalle.titulo === 'string' ? detalle.titulo : '';
    limite = Nucleo.ajustarLimite(detalle.limite);

    // No se pisa lo que el usuario está escribiendo mientras corre el debounce.
    if (campoBusqueda && temporizador === null) campoBusqueda.value = titulo;

    terminarCarga();
    ocultar(mensajeError);
    renderizarResultados(detalle);
  }

  async function iniciar() {
    if (iniciado) return;
    iniciado = true;

    if (!Nucleo || !Estado || !Formato) {
      console.error('[libreria] Faltan módulos para iniciar el catálogo.');
      return;
    }

    if (formulario) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        cancelarDebounce();
        titulo = campoBusqueda ? campoBusqueda.value.trim() : '';
        offset = 0;
        recargar();
      });

      formulario.addEventListener('reset', function () {
        cancelarDebounce();
        // El navegador limpia el campo después de emitir el evento reset.
        setTimeout(function () {
          titulo = '';
          offset = 0;
          recargar();
        }, 0);
      });
    }

    if (campoBusqueda) {
      campoBusqueda.addEventListener('input', function () {
        if (temporizador !== null) clearTimeout(temporizador);
        temporizador = setTimeout(function () {
          temporizador = null;
          titulo = campoBusqueda.value.trim();
          offset = 0;
          recargar();
        }, 300);
      });
    }

    if (botonAnterior) {
      botonAnterior.addEventListener('click', function () {
        offset = Math.max(0, offset - limite);
        recargar();
      });
    }

    if (botonSiguiente) {
      botonSiguiente.addEventListener('click', function () {
        offset = offset + limite;
        recargar();
      });
    }

    if (botonReintentar) {
      botonReintentar.addEventListener('click', function () {
        recargar();
      });
    }

    if (lista) {
      lista.addEventListener('click', function (evento) {
        var boton = evento.target && evento.target.closest
          ? evento.target.closest('button[data-libro-id]')
          : null;
        if (!boton || !lista.contains(boton)) return;
        alternarAutores(boton);
      });
    }

    document.addEventListener('libreria:catalogo', adoptarCatalogoExterno);
    await recargar();
  }

  window.LibreriaCatalogo = { iniciar: iniciar, recargar: recargar };
})();
