(function (global, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  global.LibreriaApi = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var nucleo = typeof module === 'object' && module.exports
    ? require('./nucleo.js')
    : globalThis.LibreriaNucleo;

  function obtenerConfig() {
    var config = typeof globalThis !== 'undefined' ? globalThis.LIBRERIA_CONFIG : null;
    if (!config || typeof config.API_BASE !== 'string' || config.API_BASE === '') {
      throw new Error('Falta LIBRERIA_CONFIG con API_BASE. Cargá config.js antes de api.js.');
    }
    return config;
  }

  function normalizarRuta(ruta) {
    var texto = typeof ruta === 'string' ? ruta : '';
    if (texto === '') return '/';
    return texto.charAt(0) === '/' ? texto : '/' + texto;
  }

  function segmentoId(id) {
    return encodeURIComponent(nucleo.normalizarId(id));
  }

  // Lee JSON tolerando respuestas sin cuerpo; no oculta las cancelaciones.
  async function leerJson(respuesta) {
    if (!respuesta || respuesta.status === 204) return null;
    try {
      return await respuesta.json();
    } catch (error) {
      if (error && error.name === 'AbortError') throw error;
      return null;
    }
  }

  // Combina el timeout interno con una señal externa opcional.
  function prepararAborto(senalExterna, timeoutMs) {
    var controlador = new AbortController();
    var estadoAborto = { externo: false };
    var manejadorExterno = null;

    if (senalExterna && typeof senalExterna.addEventListener === 'function') {
      if (senalExterna.aborted) {
        estadoAborto.externo = true;
        controlador.abort();
      } else {
        manejadorExterno = function () {
          estadoAborto.externo = true;
          controlador.abort();
        };
        senalExterna.addEventListener('abort', manejadorExterno, { once: true });
      }
    }

    var espera = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 10000;
    var temporizador = setTimeout(function () {
      controlador.abort();
    }, espera);

    return {
      controlador: controlador,
      estado: estadoAborto,
      limpiar: function () {
        clearTimeout(temporizador);
        if (manejadorExterno) {
          senalExterna.removeEventListener('abort', manejadorExterno);
        }
      }
    };
  }

  class ErrorApi extends Error {
    constructor(mensaje, opciones) {
      super(mensaje);
      var valores = opciones || {};

      this.name = 'ErrorApi';
      this.estado = typeof valores.estado === 'number' && Number.isFinite(valores.estado)
        ? valores.estado
        : null;
      this.detalles = Array.isArray(valores.detalles) ? valores.detalles : null;
      this.red = valores.red === true;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorApi);
      }
    }
  }

  // Realiza una petición y devuelve { datos, estado } o lanza ErrorApi.
  async function pedir(ruta, opciones) {
    var pedido = opciones || {};

    if (typeof globalThis.fetch !== 'function') {
      throw new Error('No está disponible fetch en este entorno para consultar la API.');
    }

    var config = obtenerConfig();
    var metodo = String(pedido.metodo || 'GET').toUpperCase();
    var base = String(config.API_BASE).replace(/\/+$/, '');
    var url = base + normalizarRuta(ruta);

    var headers = { Accept: 'application/json' };
    var cuerpo;

    if (pedido.cuerpo !== undefined) {
      headers['Content-Type'] = 'application/json';
      cuerpo = JSON.stringify(pedido.cuerpo);
    }

    var aborto = prepararAborto(pedido.senal, config.TIMEOUT_MS);

    try {
      var respuesta = await globalThis.fetch(url, {
        method: metodo,
        headers: headers,
        body: cuerpo,
        signal: aborto.controlador.signal
      });

      if (!respuesta || respuesta.ok !== true) {
        var estadoError = respuesta ? respuesta.status : 0;
        var cuerpoError = respuesta ? await leerJson(respuesta) : null;
        var detalles = cuerpoError && Array.isArray(cuerpoError.detail)
          ? cuerpoError.detail
          : null;
        var mensaje = nucleo.mensajeDeError({
          estado: estadoError,
          cuerpo: cuerpoError
        });

        throw new ErrorApi(mensaje, {
          estado: estadoError,
          detalles: detalles
        });
      }

      var datos = await leerJson(respuesta);
      return { datos: datos, estado: respuesta.status };
    } catch (error) {
      if (error instanceof ErrorApi) throw error;

      if (aborto.estado.externo && error && error.name === 'AbortError') {
        throw error;
      }

      throw new ErrorApi(nucleo.mensajeDeError({ red: true }), { red: true });
    } finally {
      aborto.limpiar();
    }
  }

  function obtenerLibros(opciones) {
    var valores = opciones || {};
    var consulta = nucleo.construirConsulta({
      limit: valores.limit,
      offset: valores.offset,
      titulo: valores.titulo,
      genero_id: valores.genero_id
    });
    return pedir('/libros/' + consulta);
  }

  function obtenerLibro(id) {
    return pedir('/libros/' + segmentoId(id));
  }

  function obtenerEditoriales(opciones) {
    var valores = opciones || {};
    var consulta = nucleo.construirConsulta({
      limit: valores.limit,
      offset: valores.offset
    });
    return pedir('/editoriales/' + consulta);
  }

  function obtenerGeneros(opciones) {
    var valores = opciones || {};
    var consulta = nucleo.construirConsulta({
      limit: valores.limit,
      offset: valores.offset
    });
    return pedir('/generos/' + consulta);
  }

  function obtenerAutor(id) {
    return pedir('/autores/' + segmentoId(id));
  }

  function crearLibro(dto) {
    return pedir('/libros/', { metodo: 'POST', cuerpo: dto });
  }

  function obtenerCliente(id) {
    return pedir('/clientes/' + segmentoId(id));
  }

  function crearCliente(dto) {
    return pedir('/clientes/', { metodo: 'POST', cuerpo: dto });
  }

  function crearVenta(dto) {
    return pedir('/ventas/', { metodo: 'POST', cuerpo: dto });
  }

  function obtenerVentas(opciones) {
    var valores = opciones || {};
    var consulta = nucleo.construirConsulta({
      limit: valores.limit,
      offset: valores.offset
    });
    return pedir('/ventas/' + consulta);
  }

  function obtenerVenta(id) {
    return pedir('/ventas/' + segmentoId(id));
  }

  function estadoSalud() {
    return pedir('/health/ready');
  }

  async function cargarTodasEditoriales() {
    var ultimoEstado = null;
    var datos = await nucleo.recolectarPaginas(async function (parametros) {
      var respuesta = await obtenerEditoriales(parametros);
      ultimoEstado = respuesta.estado;
      return respuesta.datos;
    });

    return { datos: datos, estado: ultimoEstado };
  }

  async function cargarTodosGeneros() {
    var ultimoEstado = null;
    var datos = await nucleo.recolectarPaginas(async function (parametros) {
      var respuesta = await obtenerGeneros(parametros);
      ultimoEstado = respuesta.estado;
      return respuesta.datos;
    });

    return { datos: datos, estado: ultimoEstado };
  }

  return {
    ErrorApi: ErrorApi,
    pedir: pedir,
    obtenerLibros: obtenerLibros,
    obtenerLibro: obtenerLibro,
    obtenerEditoriales: obtenerEditoriales,
    obtenerGeneros: obtenerGeneros,
    obtenerAutor: obtenerAutor,
    crearLibro: crearLibro,
    obtenerCliente: obtenerCliente,
    crearCliente: crearCliente,
    crearVenta: crearVenta,
    obtenerVentas: obtenerVentas,
    obtenerVenta: obtenerVenta,
    estadoSalud: estadoSalud,
    cargarTodasEditoriales: cargarTodasEditoriales,
    cargarTodosGeneros: cargarTodosGeneros
  };
});
