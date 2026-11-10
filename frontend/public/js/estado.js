(function (global, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  global.LibreriaEstado = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var nucleo = typeof module === 'object' && module.exports
    ? require('./nucleo.js')
    : globalThis.LibreriaNucleo;

  var api = typeof module === 'object' && module.exports
    ? require('./api.js')
    : globalThis.LibreriaApi;

  function limiteConfigurado() {
    var config = typeof globalThis !== 'undefined' ? globalThis.LIBRERIA_CONFIG : null;
    return config ? nucleo.ajustarLimite(config.LIMITE) : 20;
  }

  // Acepta tanto un array como la forma { datos, estado }.
  function extraerDatos(respuesta) {
    if (Array.isArray(respuesta)) return respuesta;
    if (respuesta && Array.isArray(respuesta.datos)) return respuesta.datos;
    return [];
  }

  function emitirCatalogo(detalle) {
    if (typeof document === 'undefined' || !document || typeof document.dispatchEvent !== 'function') {
      return;
    }
    if (typeof CustomEvent !== 'function') return;

    document.dispatchEvent(new CustomEvent('libreria:catalogo', { detail: detalle }));
  }

  var estado = {
    datos: {
      editoriales: [],
      generos: [],
      libros: [],
      offset: 0,
      titulo: '',
      recibidos: 0
    },

    clientesPorId: new Map(),
    autoresPorId: new Map(),
    autoresPorLibro: new Map(),

    // Carga editoriales y géneros para los selectores de las vistas.
    async cargarOpciones() {
      var respuestas = await Promise.all([
        api.cargarTodasEditoriales(),
        api.cargarTodosGeneros()
      ]);

      var editoriales = extraerDatos(respuestas[0]);
      var generos = extraerDatos(respuestas[1]);

      estado.datos.editoriales = editoriales;
      estado.datos.generos = generos;

      return { editoriales: editoriales, generos: generos };
    },

    // Carga una página del catálogo y notifica a las vistas mediante un evento.
    async cargarCatalogo(opciones) {
      var valores = opciones || {};
      var limite = limiteConfigurado();
      var offset = nucleo.ajustarOffset(valores.offset);
      var titulo = valores.titulo === undefined || valores.titulo === null
        ? ''
        : String(valores.titulo).trim();

      var respuesta = await api.obtenerLibros({
        limit: limite,
        offset: offset,
        titulo: titulo
      });

      var crudos = extraerDatos(respuesta);
      var libros = crudos.map(nucleo.normalizarLibro);

      estado.datos.libros = libros;
      estado.datos.offset = offset;
      estado.datos.titulo = titulo;
      estado.datos.recibidos = libros.length;

      var detalle = {
        libros: libros,
        offset: offset,
        titulo: titulo,
        recibidos: libros.length,
        limite: limite
      };

      emitirCatalogo(detalle);
      return detalle;
    },

    // Devuelve las autorías de un libro, usando la caché de la sesión.
    async cargarAutoresDeLibro(id) {
      var clave = nucleo.normalizarId(id);
      if (clave === '') return [];

      if (estado.autoresPorLibro.has(clave)) {
        return estado.autoresPorLibro.get(clave);
      }

      var respuesta = await api.obtenerLibro(clave);
      var libro = respuesta ? respuesta.datos : null;
      var crudos = libro && Array.isArray(libro.autores) ? libro.autores : [];
      var autores = crudos.map(nucleo.normalizarAutoria);

      estado.autoresPorLibro.set(clave, autores);
      for (var i = 0; i < autores.length; i += 1) {
        estado.recordarAutor({ id: autores[i].autorId, nombre: autores[i].nombre });
      }

      return autores;
    },

    recordarCliente(cliente) {
      var valor = cliente || {};
      var id = nucleo.normalizarId(valor.id);
      if (id !== '') estado.clientesPorId.set(id, valor);
      return valor;
    },

    obtenerCliente(id) {
      var clave = nucleo.normalizarId(id);
      if (clave === '' || !estado.clientesPorId.has(clave)) return null;
      return estado.clientesPorId.get(clave);
    },

    clientesConocidos() {
      return Array.from(estado.clientesPorId.values());
    },

    recordarAutor(autor) {
      var valor = autor || {};
      var idOriginal = valor.id !== undefined && valor.id !== null ? valor.id : valor.autorId;
      var id = nucleo.normalizarId(idOriginal);

      if (id !== '') {
        estado.autoresPorId.set(id, valor);
      } else if (typeof valor.nombre === 'string' && valor.nombre.trim() !== '') {
        estado.autoresPorId.set('nombre:' + valor.nombre.trim().toLowerCase(), valor);
      }

      return valor;
    },

    // Busca un autor recordado por id o por nombre (sin distinguir mayúsculas).
    obtenerAutor(clave) {
      var id = nucleo.normalizarId(clave);
      if (id !== '' && estado.autoresPorId.has(id)) {
        return estado.autoresPorId.get(id);
      }

      var nombre = typeof clave === 'string' ? clave.trim().toLowerCase() : '';
      if (nombre === '') return null;

      var recordados = Array.from(estado.autoresPorId.values());
      for (var i = 0; i < recordados.length; i += 1) {
        var registrado = recordados[i];
        if (typeof registrado.nombre === 'string' &&
            registrado.nombre.trim().toLowerCase() === nombre) {
          return registrado;
        }
      }

      return estado.autoresPorId.has('nombre:' + nombre)
        ? estado.autoresPorId.get('nombre:' + nombre)
        : null;
    },

    // Inserta o actualiza un libro en la lista actual del catálogo.
    recordarLibro(libro) {
      var valor = libro || {};
      var id = nucleo.normalizarId(valor.id);
      if (id === '') return valor;

      var libros = estado.datos.libros;
      for (var i = 0; i < libros.length; i += 1) {
        if (nucleo.normalizarId(libros[i].id) === id) {
          libros[i] = valor;
          return valor;
        }
      }

      libros.push(valor);
      return valor;
    }
  };

  return estado;
});
