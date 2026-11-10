// Historial paginado de ventas contra la API.
// El listado nunca trae renglones: el detalle se consulta por venta y muestra
// los importes históricos que devolvió el servidor.
(function () {
  'use strict';

  var nucleo = window.LibreriaNucleo;
  var formato = window.LibreriaFormato;
  var api = window.LibreriaApi;
  var config = window.LIBRERIA_CONFIG || { LIMITE: 20 };

  if (!nucleo || !formato || !api) {
    console.error('Error: faltan módulos base para iniciar el historial.');
    return;
  }

  // Estado local de la paginación.
  var offset = 0;
  var limite = nucleo.ajustarLimite(config.LIMITE);
  var cargando = false;
  var generacion = 0;
  var generacionDetalle = 0;
  var ultimaPaginacion = { anterior: false, siguiente: false };

  // Elementos del DOM.
  var mensajeError = document.getElementById('mensaje-error-historial');
  var textoError = document.getElementById('texto-error-historial');
  var botonReintentar = document.getElementById('boton-reintentar-historial');
  var tablaVentas = document.getElementById('tabla-ventas');
  var cuerpoVentas = document.getElementById('cuerpo-ventas');
  var mensajeVacio = document.getElementById('mensaje-historial-vacio');
  var paginacion = document.getElementById('paginacion-historial');
  var botonAnterior = document.getElementById('boton-historial-anterior');
  var botonSiguiente = document.getElementById('boton-historial-siguiente');
  var resumenPaginacion = document.getElementById('resumen-paginacion-historial');
  var detalleVenta = document.getElementById('detalle-venta');
  var detalleResumen = document.getElementById('detalle-venta-resumen');
  var cuerpoDetalle = document.getElementById('cuerpo-detalle-venta');
  var totalDetalle = document.getElementById('detalle-venta-total');

  // ---------- Utilidades ----------

  function crearCelda(texto) {
    var celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
  }

  function ocultarError() {
    if (textoError) {
      textoError.textContent = 'No se pudo cargar el historial.';
    }
    if (mensajeError) mensajeError.hidden = true;
  }

  function mostrarError(texto) {
    if (textoError) textoError.textContent = texto;
    if (mensajeError) mensajeError.hidden = false;
  }

  function aplicarPaginacion(paginacionCalculada) {
    ultimaPaginacion = {
      anterior: Boolean(paginacionCalculada.anterior),
      siguiente: Boolean(paginacionCalculada.siguiente)
    };
    if (botonAnterior) botonAnterior.disabled = !ultimaPaginacion.anterior;
    if (botonSiguiente) botonSiguiente.disabled = !ultimaPaginacion.siguiente;
  }

  // ---------- Listado ----------

  function renderizarVentas(ventas) {
    if (!cuerpoVentas) return;

    cuerpoVentas.replaceChildren();

    ventas.forEach(function (venta) {
      var fila = document.createElement('tr');
      fila.appendChild(crearCelda(venta.id));
      fila.appendChild(crearCelda(formato.formatearFecha(venta.fecha)));
      fila.appendChild(crearCelda(venta.clienteNombre));
      fila.appendChild(crearCelda(formato.formatearImporte(venta.totalNumero)));

      var celdaDetalle = document.createElement('td');
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'boton boton--secundario';
      boton.textContent = 'Ver detalle';
      boton.dataset.ventaId = venta.id;

      celdaDetalle.appendChild(boton);
      fila.appendChild(celdaDetalle);
      cuerpoVentas.appendChild(fila);
    });
  }

  async function recargar() {
    generacion += 1;
    var miGeneracion = generacion;
    var fallo = false;

    cargando = true;
    if (botonAnterior) botonAnterior.disabled = true;
    if (botonSiguiente) botonSiguiente.disabled = true;
    if (tablaVentas) tablaVentas.setAttribute('aria-busy', 'true');
    if (mensajeVacio) mensajeVacio.hidden = true;
    ocultarError();

    try {
      var respuesta = await api.obtenerVentas({ limit: limite, offset: offset });

      // Una recarga más nueva ya tomó el control: se descarta esta respuesta.
      if (miGeneracion !== generacion) return;

      var datos = respuesta && Array.isArray(respuesta.datos) ? respuesta.datos : [];
      var ventas = datos.map(nucleo.normalizarVenta);

      renderizarVentas(ventas);

      // Si la página quedó fuera de rango, se vuelve a la anterior sin
      // mostrar el mensaje de historial vacío.
      if (datos.length === 0 && offset > 0) {
        offset = Math.max(0, offset - limite);
        recargar();
        return;
      }

      var pag = nucleo.calcularPaginacion({
        offset: offset,
        limit: limite,
        recibidos: datos.length
      });

      if (paginacion) {
        paginacion.hidden = !(datos.length > 0 || offset > 0);
      }
      aplicarPaginacion(pag);

      if (resumenPaginacion) {
        resumenPaginacion.textContent = datos.length > 0
          ? 'Mostrando ' + pag.desde + '–' + pag.hasta
          : 'Sin ventas';
      }

      if (mensajeVacio) {
        mensajeVacio.hidden = !(datos.length === 0 && offset === 0);
      }
    } catch (error) {
      if (miGeneracion !== generacion) return;

      fallo = true;
      if (mensajeVacio) mensajeVacio.hidden = true;
      mostrarError(error && error.message ? error.message : 'No se pudo cargar el historial.');
    } finally {
      if (miGeneracion === generacion) {
        cargando = false;
        if (tablaVentas) tablaVentas.setAttribute('aria-busy', 'false');

        // Tras un error ambos botones quedan habilitados para poder reintentar.
        if (fallo) {
          if (botonAnterior) botonAnterior.disabled = false;
          if (botonSiguiente) botonSiguiente.disabled = false;
        } else {
          if (botonAnterior) botonAnterior.disabled = !ultimaPaginacion.anterior;
          if (botonSiguiente) botonSiguiente.disabled = !ultimaPaginacion.siguiente;
        }
      }
    }
  }

  // ---------- Detalle ----------

  function limpiarDetalle() {
    if (cuerpoDetalle) cuerpoDetalle.replaceChildren();
    if (totalDetalle) totalDetalle.textContent = '—';
  }

  async function mostrarDetalle(id, boton) {
    generacionDetalle += 1;
    var miGeneracion = generacionDetalle;

    if (boton) {
      boton.disabled = true;
      boton.textContent = 'Cargando…';
    }

    try {
      var respuesta = await api.obtenerVenta(id);

      if (miGeneracion !== generacionDetalle) return;

      var venta = nucleo.normalizarVenta(respuesta ? respuesta.datos : null);

      if (detalleResumen) {
        detalleResumen.textContent = 'Detalle de la venta ' + venta.id + ' — ' +
          venta.clienteNombre + ' — ' + formato.formatearFecha(venta.fecha);
      }

      if (cuerpoDetalle) {
        cuerpoDetalle.replaceChildren();

        venta.renglones.forEach(function (renglon) {
          var fila = document.createElement('tr');
          fila.appendChild(crearCelda(renglon.titulo));
          fila.appendChild(crearCelda(formato.formatearCantidad(renglon.cantidad)));
          fila.appendChild(crearCelda(formato.formatearImporte(renglon.precioUnitarioNumero)));
          fila.appendChild(crearCelda(formato.formatearImporte(renglon.subtotalNumero)));
          cuerpoDetalle.appendChild(fila);
        });
      }

      if (totalDetalle) {
        totalDetalle.textContent = formato.formatearImporte(venta.totalNumero);
      }

      if (detalleVenta) {
        detalleVenta.open = true;
        if (typeof detalleVenta.scrollIntoView === 'function') {
          detalleVenta.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (error) {
      if (miGeneracion !== generacionDetalle) return;

      limpiarDetalle();

      if (detalleResumen) {
        detalleResumen.textContent = 'No se pudo cargar el detalle: ' +
          (error && error.message ? error.message : 'No se pudo consultar la venta.');
      }
      if (detalleVenta) detalleVenta.open = true;
    } finally {
      if (boton) {
        boton.disabled = false;
        boton.textContent = 'Ver detalle';
      }
    }
  }

  // ---------- Eventos e inicio ----------

  function conectarEventos() {
    if (botonAnterior) {
      botonAnterior.addEventListener('click', function () {
        offset = Math.max(0, offset - limite);
        recargar();
      });
    }

    if (botonSiguiente) {
      botonSiguiente.addEventListener('click', function () {
        offset += limite;
        recargar();
      });
    }

    if (botonReintentar) {
      botonReintentar.addEventListener('click', function () {
        recargar();
      });
    }

    if (cuerpoVentas) {
      cuerpoVentas.addEventListener('click', function (evento) {
        var boton = evento.target && evento.target.closest
          ? evento.target.closest('[data-venta-id]')
          : null;
        if (!boton) return;

        mostrarDetalle(boton.dataset.ventaId, boton);
      });
    }

    document.addEventListener('libreria:venta-creada', function () {
      offset = 0;
      recargar();
    });
  }

  async function iniciar() {
    conectarEventos();
    await recargar();
  }

  window.LibreriaHistorial = { iniciar: iniciar, recargar: recargar };
})();
