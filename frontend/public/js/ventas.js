// Composición y confirmación de ventas contra la API.
// El borrador vive solo en memoria: el precio unitario se copia del catálogo
// al agregar el renglón y el total definitivo lo calcula el servidor.
(function () {
  'use strict';

  var nucleo = window.LibreriaNucleo;
  var formato = window.LibreriaFormato;
  var api = window.LibreriaApi;
  var estado = window.LibreriaEstado;
  var config = window.LIBRERIA_CONFIG || { LIMITE: 20 };

  if (!nucleo || !formato || !api || !estado) {
    console.error('Error: faltan módulos base para iniciar la vista de ventas.');
    return;
  }

  // Estado local del borrador.
  var renglones = [];
  var librosDisponibles = [];
  var enviando = false;
  var agregando = false;
  var generacionLibros = 0;
  var temporizadorBusqueda = null;
  var ultimoErrorLibros = '';

  // Elementos del DOM.
  var formulario = document.getElementById('formulario-venta');
  var selectCliente = document.getElementById('venta-cliente');
  var buscarLibro = document.getElementById('venta-buscar-libro');
  var selectLibro = document.getElementById('venta-libro');
  var inputCantidad = document.getElementById('venta-cantidad');
  var botonAgregar = document.getElementById('boton-agregar-renglon');
  var cuerpoRenglones = document.getElementById('cuerpo-renglones');
  var totalVenta = document.getElementById('total-venta');
  var mensajeRenglonesVacio = document.getElementById('mensaje-renglones-vacio');
  var botonConfirmar = document.getElementById('boton-confirmar-venta');
  var estadoEnvio = document.getElementById('estado-envio-venta');
  var mensajeExito = document.getElementById('mensaje-exito-venta');
  var mensajeError = document.getElementById('mensaje-error-venta');

  var TEXTO_CONFIRMAR = 'Confirmar venta';

  // ---------- Utilidades de interfaz ----------

  function escribirMensaje(elemento, texto) {
    if (!elemento) return;
    var parrafo = elemento.querySelector('.mensaje__texto');
    if (parrafo) parrafo.textContent = texto;
    elemento.hidden = false;
  }

  function mostrarError(texto) {
    ultimoErrorLibros = '';
    if (mensajeExito) mensajeExito.hidden = true;
    escribirMensaje(mensajeError, texto);
  }

  function mostrarExito(texto) {
    ultimoErrorLibros = '';
    if (mensajeError) mensajeError.hidden = true;
    escribirMensaje(mensajeExito, texto);
  }

  function ocultarMensajes() {
    ultimoErrorLibros = '';
    if (mensajeExito) mensajeExito.hidden = true;
    if (mensajeError) mensajeError.hidden = true;
  }

  function crearOpcion(valor, etiqueta) {
    var opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = etiqueta;
    return opcion;
  }

  function crearCelda(texto) {
    var celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
  }

  // ---------- Cantidades ----------

  function leerCantidad(texto) {
    var limpio = String(texto == null ? '' : texto).trim();
    if (limpio === '') return NaN;
    return Number(limpio);
  }

  function cantidadValida(cantidad) {
    return Number.isInteger(cantidad) && cantidad > 0;
  }

  function subtotalDe(renglon) {
    return formato.formatearImporte(renglon.precioUnitario * renglon.cantidad);
  }

  // ---------- Selectores ----------

  function renderizarClientes() {
    if (!selectCliente) return;

    var seleccionado = selectCliente.value;
    var clientes = estado.clientesConocidos();

    selectCliente.replaceChildren();
    selectCliente.appendChild(crearOpcion('', 'Elegí un cliente consultado'));

    clientes.forEach(function (cliente) {
      var id = nucleo.normalizarId(cliente && cliente.id);
      if (id === '') return;

      var nombre = cliente && cliente.nombre != null ? String(cliente.nombre) : '';
      var email = cliente && cliente.email != null ? String(cliente.email) : '';
      selectCliente.appendChild(crearOpcion(id, nombre + ' (' + email + ')'));
    });

    // Si el cliente elegido sigue en la lista, se conserva.
    selectCliente.value = seleccionado;
  }

  function renderizarLibros() {
    if (!selectLibro) return;

    var seleccionado = selectLibro.value;

    selectLibro.replaceChildren();
    selectLibro.appendChild(crearOpcion('', 'Elegí un libro'));

    librosDisponibles.forEach(function (libro) {
      var id = nucleo.normalizarId(libro && libro.id);
      if (id === '') return;

      var titulo = libro && libro.titulo != null ? String(libro.titulo) : '';
      selectLibro.appendChild(crearOpcion(id, titulo + ' (' + formato.formatearImporte(libro.precioNumero) + ')'));
    });

    selectLibro.value = seleccionado;
  }

  function buscarLibroPorId(libroId) {
    var buscado = nucleo.normalizarId(libroId);
    if (buscado === '') return null;

    for (var i = 0; i < librosDisponibles.length; i += 1) {
      if (nucleo.normalizarId(librosDisponibles[i].id) === buscado) {
        return librosDisponibles[i];
      }
    }

    return null;
  }

  // ---------- Carga del catálogo para la venta ----------

  // Oculta el error solo si sigue siendo el de la última búsqueda de libros.
  function limpiarErrorLibros() {
    if (ultimoErrorLibros === '') return;

    var parrafo = mensajeError ? mensajeError.querySelector('.mensaje__texto') : null;
    if (parrafo && parrafo.textContent === ultimoErrorLibros) {
      mensajeError.hidden = true;
    }
    ultimoErrorLibros = '';
  }

  async function cargarLibros(opciones) {
    var titulo = opciones && opciones.titulo != null ? String(opciones.titulo).trim() : '';

    generacionLibros += 1;
    var miGeneracion = generacionLibros;

    try {
      var respuesta = await api.obtenerLibros({
        limit: config.LIMITE,
        offset: 0,
        titulo: titulo
      });

      // Una búsqueda más nueva ya tomó el control: se descarta esta respuesta.
      if (miGeneracion !== generacionLibros) return;

      var crudos = respuesta && Array.isArray(respuesta.datos) ? respuesta.datos : [];
      librosDisponibles = crudos.map(nucleo.normalizarLibro);

      librosDisponibles.forEach(function (libro) {
        estado.recordarLibro(libro);
      });

      renderizarLibros();
      limpiarErrorLibros();
    } catch (error) {
      if (miGeneracion !== generacionLibros) return;

      var texto = error && error.message ? error.message : 'No se pudieron cargar los libros.';
      ultimoErrorLibros = texto;
      if (mensajeExito) mensajeExito.hidden = true;
      escribirMensaje(mensajeError, texto);
    }
  }

  function programarBusqueda() {
    if (temporizadorBusqueda !== null) {
      clearTimeout(temporizadorBusqueda);
    }

    temporizadorBusqueda = setTimeout(function () {
      temporizadorBusqueda = null;
      cargarLibros({ titulo: buscarLibro ? buscarLibro.value : '' });
    }, 300);
  }

  // ---------- Renglones ----------

  function actualizarTotal() {
    if (!totalVenta) return;

    var total = 0;

    for (var i = 0; i < renglones.length; i += 1) {
      var renglon = renglones[i];
      if (!cantidadValida(renglon.cantidad)) {
        totalVenta.textContent = '—';
        return;
      }
      total += renglon.cantidad * renglon.precioUnitario;
    }

    totalVenta.textContent = formato.formatearImporte(total);
  }

  function renderizarRenglones() {
    if (!cuerpoRenglones) return;

    cuerpoRenglones.replaceChildren();

    renglones.forEach(function (renglon, indice) {
      var fila = document.createElement('tr');
      fila.appendChild(crearCelda(renglon.titulo));

      var celdaCantidad = document.createElement('td');
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'campo__control tabla__cantidad';
      input.min = '1';
      input.step = '1';
      input.value = Number.isFinite(renglon.cantidad) ? String(renglon.cantidad) : '';
      input.dataset.accion = 'cantidad';
      input.dataset.indice = String(indice);
      input.setAttribute('aria-label', 'Cantidad de ' + renglon.titulo);
      if (!cantidadValida(renglon.cantidad)) {
        input.setAttribute('aria-invalid', 'true');
      }
      celdaCantidad.appendChild(input);
      fila.appendChild(celdaCantidad);

      fila.appendChild(crearCelda(formato.formatearImporte(renglon.precioUnitario)));

      var celdaSubtotal = crearCelda(subtotalDe(renglon));
      celdaSubtotal.dataset.subtotal = 'true';
      fila.appendChild(celdaSubtotal);

      var celdaAcciones = document.createElement('td');
      var acciones = document.createElement('div');
      acciones.className = 'tabla__acciones';

      var botonQuitar = document.createElement('button');
      botonQuitar.type = 'button';
      botonQuitar.className = 'boton boton--secundario';
      botonQuitar.textContent = 'Quitar renglón';
      botonQuitar.dataset.quitarIndice = String(indice);

      acciones.appendChild(botonQuitar);
      celdaAcciones.appendChild(acciones);
      fila.appendChild(celdaAcciones);

      cuerpoRenglones.appendChild(fila);
    });

    actualizarTotal();

    if (mensajeRenglonesVacio) {
      mensajeRenglonesVacio.hidden = renglones.length > 0;
    }
  }

  async function agregarRenglon() {
    if (agregando) return;

    var libroId = selectLibro ? nucleo.normalizarId(selectLibro.value) : '';
    if (libroId === '') {
      mostrarError('Elegí un libro antes de agregar el renglón.');
      return;
    }

    var cantidad = leerCantidad(inputCantidad ? inputCantidad.value : '');
    if (!cantidadValida(cantidad)) {
      mostrarError('La cantidad debe ser un número entero mayor que cero.');
      return;
    }

    var repetido = renglones.some(function (renglon) {
      return nucleo.normalizarId(renglon.libroId) === libroId;
    });
    if (repetido) {
      mostrarError('Ese libro ya tiene un renglón en la venta; modificá su cantidad en la tabla.');
      return;
    }

    var libro = buscarLibroPorId(libroId);

    // El libro puede venir de una búsqueda anterior: se consulta antes de usarlo.
    if (!libro) {
      agregando = true;
      if (botonAgregar) botonAgregar.disabled = true;

      try {
        var respuesta = await api.obtenerLibro(libroId);
        libro = nucleo.normalizarLibro(respuesta ? respuesta.datos : null);
        estado.recordarLibro(libro);
      } catch (error) {
        mostrarError(error && error.message ? error.message : 'No se pudo consultar el libro.');
        return;
      } finally {
        agregando = false;
        if (botonAgregar) botonAgregar.disabled = false;
      }
    }

    renglones.push({
      libroId: libroId,
      cantidad: cantidad,
      titulo: libro.titulo,
      precioUnitario: libro.precioNumero
    });

    renderizarRenglones();
    ocultarMensajes();

    if (selectLibro) selectLibro.value = '';
    if (inputCantidad) inputCantidad.value = '';
    if (selectLibro) selectLibro.focus();
  }

  function cambiarCantidad(evento) {
    var input = evento.target;
    if (!input || !input.dataset || input.dataset.accion !== 'cantidad') return;

    var indice = Number(input.dataset.indice);
    var renglon = renglones[indice];
    if (!renglon) return;

    renglon.cantidad = leerCantidad(input.value);

    if (cantidadValida(renglon.cantidad)) {
      input.removeAttribute('aria-invalid');
    } else {
      input.setAttribute('aria-invalid', 'true');
    }

    // Se actualiza solo la fila afectada para no perder el foco del campo.
    var fila = input.closest('tr');
    var celdaSubtotal = fila ? fila.querySelector('[data-subtotal]') : null;
    if (celdaSubtotal) {
      celdaSubtotal.textContent = subtotalDe(renglon);
    }

    actualizarTotal();
  }

  function quitarRenglon(evento) {
    var boton = evento.target && evento.target.closest
      ? evento.target.closest('[data-quitar-indice]')
      : null;
    if (!boton) return;

    var indice = Number(boton.dataset.quitarIndice);
    if (!Number.isInteger(indice) || indice < 0 || indice >= renglones.length) return;

    renglones.splice(indice, 1);
    renderizarRenglones();
  }

  // ---------- Confirmación ----------

  function validarBorrador(clienteId) {
    if (clienteId === '' || !estado.obtenerCliente(clienteId)) {
      return 'Consultá o registrá el cliente antes de confirmar.';
    }

    if (renglones.length === 0) {
      return 'Agregá al menos un renglón antes de confirmar la venta.';
    }

    var vistos = Object.create(null);

    for (var i = 0; i < renglones.length; i += 1) {
      var renglon = renglones[i];

      if (!cantidadValida(renglon.cantidad)) {
        return 'Revisá las cantidades: deben ser números enteros mayores que cero.';
      }

      var id = nucleo.normalizarId(renglon.libroId);
      if (vistos[id]) {
        return 'No se puede repetir un libro en la misma venta.';
      }
      vistos[id] = true;
    }

    return '';
  }

  async function confirmarVenta() {
    if (enviando) return;

    var clienteId = selectCliente ? nucleo.normalizarId(selectCliente.value) : '';
    var errorValidacion = validarBorrador(clienteId);

    if (errorValidacion !== '') {
      mostrarError(errorValidacion);
      return;
    }

    enviando = true;
    if (botonConfirmar) {
      botonConfirmar.disabled = true;
      botonConfirmar.textContent = 'Confirmando…';
    }
    if (estadoEnvio) estadoEnvio.textContent = 'Enviando la venta a la API…';
    if (formulario) formulario.setAttribute('aria-busy', 'true');
    ocultarMensajes();

    try {
      var respuesta = await api.crearVenta({
        cliente_id: Number(clienteId),
        renglones: renglones.map(function (renglon) {
          return {
            libro_id: Number(renglon.libroId),
            cantidad: renglon.cantidad
          };
        })
      });

      var venta = nucleo.normalizarVenta(respuesta ? respuesta.datos : null);

      mostrarExito('Venta ' + venta.id + ' confirmada por ' + formato.formatearImporte(venta.totalNumero) + '.');

      renglones = [];
      renderizarRenglones();

      if (inputCantidad) inputCantidad.value = '';
      if (selectCliente) selectCliente.value = '';
      if (selectLibro) selectLibro.value = '';

      document.dispatchEvent(new CustomEvent('libreria:venta-creada', { detail: { venta: venta } }));

      if (estadoEnvio) estadoEnvio.textContent = '';
    } catch (error) {
      // El borrador y el cliente se conservan para corregir y reintentar.
      mostrarError(error && error.message ? error.message : 'No se pudo confirmar la venta.');
    } finally {
      enviando = false;
      if (botonConfirmar) {
        botonConfirmar.disabled = false;
        botonConfirmar.textContent = TEXTO_CONFIRMAR;
      }
      if (formulario) formulario.setAttribute('aria-busy', 'false');
      if (estadoEnvio) estadoEnvio.textContent = '';
    }
  }

  // ---------- Eventos e inicio ----------

  function conectarEventos() {
    document.addEventListener('libreria:clientes', renderizarClientes);

    if (buscarLibro) {
      buscarLibro.addEventListener('input', programarBusqueda);
    }

    if (botonAgregar) {
      botonAgregar.addEventListener('click', agregarRenglon);
    }

    if (botonConfirmar) {
      botonConfirmar.addEventListener('click', confirmarVenta);
    }

    if (cuerpoRenglones) {
      cuerpoRenglones.addEventListener('input', cambiarCantidad);
      cuerpoRenglones.addEventListener('click', quitarRenglon);
    }

    // El formulario no se envía: Enter no debe recargar la página.
    if (formulario) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
      });
    }
  }

  async function iniciar() {
    renderizarClientes();
    conectarEventos();
    renderizarRenglones();
    actualizarTotal();

    await cargarLibros({ titulo: '' });
  }

  window.LibreriaVentas = { iniciar: iniciar };
})();
