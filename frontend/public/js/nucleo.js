(function (global, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  global.LibreriaNucleo = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var ROLES_AUTOR = Object.freeze(['autor', 'coautor', 'traductor', 'ilustrador']);

  // Convierte un valor a número sin aceptar cadenas vacías como cero.
  function aNumero(valor) {
    if (valor === null || valor === undefined) return NaN;
    if (typeof valor === 'string') {
      var texto = valor.trim();
      if (texto === '') return NaN;
      return Number(texto);
    }
    return Number(valor);
  }

  // Devuelve un entero entre 1 y 100; si no se puede interpretar, usa 20.
  function ajustarLimite(valor) {
    var numero = aNumero(valor);
    if (!Number.isFinite(numero)) return 20;
    numero = Math.trunc(numero);
    if (numero < 1) return 1;
    if (numero > 100) return 100;
    return numero;
  }

  // Devuelve un entero mayor o igual a cero; si no se puede interpretar, usa 0.
  function ajustarOffset(valor) {
    var numero = aNumero(valor);
    if (!Number.isFinite(numero)) return 0;
    numero = Math.trunc(numero);
    return numero < 0 ? 0 : numero;
  }

  // Arma la query string con el orden fijo que espera la API.
  function construirConsulta(params) {
    var valores = params || {};
    var partes = [];

    if (valores.limit !== undefined && valores.limit !== null && valores.limit !== '') {
      partes.push('limit=' + encodeURIComponent(String(ajustarLimite(valores.limit))));
    }
    if (valores.offset !== undefined && valores.offset !== null && valores.offset !== '') {
      partes.push('offset=' + encodeURIComponent(String(ajustarOffset(valores.offset))));
    }
    if (valores.titulo !== undefined && valores.titulo !== null) {
      var titulo = String(valores.titulo).trim();
      if (titulo !== '') {
        // encodeURIComponent codifica los espacios como %20.
        partes.push('titulo=' + encodeURIComponent(titulo));
      }
    }
    if (valores.genero_id !== undefined && valores.genero_id !== null && valores.genero_id !== '') {
      partes.push('genero_id=' + encodeURIComponent(String(valores.genero_id)));
    }

    return partes.length > 0 ? '?' + partes.join('&') : '';
  }

  // Calcula los indicadores de paginación a partir de lo efectivamente recibido.
  function calcularPaginacion(datos) {
    var valores = datos || {};
    var offset = ajustarOffset(valores.offset);
    var limit = ajustarLimite(valores.limit);
    var recibidosNumero = aNumero(valores.recibidos);
    var recibidos = Number.isFinite(recibidosNumero) ? Math.max(0, Math.trunc(recibidosNumero)) : 0;

    return {
      anterior: offset > 0,
      siguiente: recibidos === limit,
      desde: recibidos > 0 ? offset + 1 : 0,
      hasta: offset + recibidos
    };
  }

  function normalizarId(valor) {
    if (valor === null || valor === undefined) return '';
    var texto = String(valor).trim();
    return texto;
  }

  function normalizarImporte(valor) {
    var numero = aNumero(valor);
    return Number.isFinite(numero) ? numero : null;
  }

  // Traduce el error de la API a un mensaje apto para mostrar al usuario.
  function mensajeDeError(error) {
    var datos = error || {};

    if (datos.red === true) {
      return 'No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.';
    }

    var cuerpo = datos.cuerpo;
    var detalle = cuerpo ? cuerpo.detail : null;

    if (typeof detalle === 'string') {
      var texto = detalle.trim();
      if (texto !== '') return texto;
    }

    if (Array.isArray(detalle)) {
      var mensajes = [];
      for (var i = 0; i < detalle.length; i += 1) {
        var item = detalle[i];
        var mensaje = item && item.msg;
        if (typeof mensaje === 'string') {
          mensaje = mensaje.trim();
          if (mensaje !== '' && mensajes.indexOf(mensaje) === -1) {
            mensajes.push(mensaje);
          }
        }
      }
      if (mensajes.length > 0) return mensajes.join('; ');
      return 'Los datos enviados no son válidos.';
    }

    var estado = Number(datos.estado);
    if (estado === 404) return 'El recurso solicitado no existe.';
    if (estado >= 500) return 'El servidor no pudo completar la operación. Intentá de nuevo más tarde.';
    if (estado === 409) return 'La operación entra en conflicto con datos existentes.';
    return 'No se pudo completar la operación.';
  }

  function normalizarAutoria(dto) {
    var datos = dto || {};
    var ordenNumero = aNumero(datos.orden);
    var idOriginal = datos.autor_id !== undefined && datos.autor_id !== null
      ? datos.autor_id
      : datos.autorId;

    return {
      autorId: normalizarId(idOriginal),
      rol: datos.rol === undefined || datos.rol === null ? '' : String(datos.rol),
      orden: Number.isFinite(ordenNumero) ? Math.trunc(ordenNumero) : 0,
      nombre: datos.autor_nombre || ('Autor ' + (idOriginal === undefined || idOriginal === null ? '' : idOriginal))
    };
  }

  function normalizarLibro(dto) {
    var datos = dto || {};
    var copia = {};
    var clave;

    for (clave in datos) {
      if (Object.prototype.hasOwnProperty.call(datos, clave)) {
        copia[clave] = datos[clave];
      }
    }

    var stockNumero = aNumero(datos.stock);

    copia.id = normalizarId(datos.id);
    copia.precioNumero = normalizarImporte(datos.precio);
    copia.stockNumero = Number.isFinite(stockNumero) ? Math.trunc(stockNumero) : 0;
    copia.editorialNombre = datos.editorial && datos.editorial.nombre !== undefined && datos.editorial.nombre !== null
      ? datos.editorial.nombre
      : 'Desconocida';
    copia.generoNombre = datos.genero && datos.genero.nombre !== undefined && datos.genero.nombre !== null
      ? datos.genero.nombre
      : 'Sin clasificar';
    copia.autores = Array.isArray(datos.autores) ? datos.autores.map(normalizarAutoria) : [];

    return copia;
  }

  function normalizarRenglon(dto) {
    var datos = dto || {};
    var cantidadNumero = aNumero(datos.cantidad);

    return {
      libroId: normalizarId(datos.libro_id),
      titulo: datos.titulo !== undefined && datos.titulo !== null
        ? datos.titulo
        : 'Libro ' + (datos.libro_id === undefined || datos.libro_id === null ? '' : datos.libro_id),
      cantidad: Number.isFinite(cantidadNumero) ? Math.trunc(cantidadNumero) : 0,
      precioUnitarioNumero: normalizarImporte(datos.precio_unitario),
      subtotalNumero: normalizarImporte(datos.subtotal)
    };
  }

  function normalizarVenta(dto) {
    var datos = dto || {};
    var cliente = datos.cliente;

    return {
      id: normalizarId(datos.id),
      clienteId: normalizarId(datos.cliente_id),
      fecha: datos.fecha === undefined || datos.fecha === null ? '' : String(datos.fecha),
      totalNumero: normalizarImporte(datos.total),
      clienteNombre: cliente && cliente.nombre !== undefined && cliente.nombre !== null
        ? cliente.nombre
        : 'Cliente ' + (datos.cliente_id === undefined || datos.cliente_id === null ? '' : datos.cliente_id),
      renglones: Array.isArray(datos.renglones) ? datos.renglones.map(normalizarRenglon) : []
    };
  }

  function rolValido(rol) {
    return ROLES_AUTOR.indexOf(rol) !== -1;
  }

  // Recorre páginas consecutivas hasta agotar los datos o llegar al tope.
  async function recolectarPaginas(cargarPagina, opciones) {
    var configuracion = opciones || {};
    var limite = ajustarLimite(configuracion.limit);
    var maxPaginasNumero = aNumero(configuracion.maxPaginas);

    if (configuracion.maxPaginas === undefined || configuracion.maxPaginas === null) {
      maxPaginasNumero = 20;
    } else if (!Number.isFinite(maxPaginasNumero)) {
      maxPaginasNumero = 20;
    }
    maxPaginasNumero = Math.max(0, Math.trunc(maxPaginasNumero));

    var acumulado = [];

    for (var pagina = 0; pagina < maxPaginasNumero; pagina += 1) {
      var lote = await cargarPagina({ limit: limite, offset: pagina * limite });
      if (!Array.isArray(lote) || lote.length === 0) break;

      for (var i = 0; i < lote.length; i += 1) {
        acumulado.push(lote[i]);
      }

      if (lote.length < limite) break;
    }

    return acumulado;
  }

  return {
    ROLES_AUTOR: ROLES_AUTOR,
    aNumero: aNumero,
    ajustarLimite: ajustarLimite,
    ajustarOffset: ajustarOffset,
    construirConsulta: construirConsulta,
    calcularPaginacion: calcularPaginacion,
    normalizarId: normalizarId,
    normalizarImporte: normalizarImporte,
    mensajeDeError: mensajeDeError,
    normalizarAutoria: normalizarAutoria,
    normalizarLibro: normalizarLibro,
    normalizarRenglon: normalizarRenglon,
    normalizarVenta: normalizarVenta,
    rolValido: rolValido,
    recolectarPaginas: recolectarPaginas
  };
});
