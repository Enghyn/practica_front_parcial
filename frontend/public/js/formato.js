(function (global, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  global.LibreriaFormato = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var nucleo = typeof module === 'object' && module.exports
    ? require('./nucleo.js')
    : globalThis.LibreriaNucleo;

  // Formatea importes con dos decimales, punto decimal y sin miles.
  function formatearImporte(valor) {
    var numero = nucleo.normalizarImporte(valor);
    if (numero === null) return '—';
    return '$ ' + numero.toFixed(2);
  }

  // Formatea una fecha ISO en el formato local de Argentina.
  function formatearFecha(iso) {
    if (typeof iso !== 'string') return '—';
    var texto = iso.trim();
    if (texto === '') return '—';

    var fecha = new Date(texto);
    if (Number.isNaN(fecha.getTime())) return '—';
    return fecha.toLocaleString('es-AR');
  }

  function formatearCantidad(valor) {
    var numero = nucleo.aNumero(valor);
    if (!Number.isFinite(numero)) return '0';
    return String(Math.trunc(numero));
  }

  return {
    formatearImporte: formatearImporte,
    formatearFecha: formatearFecha,
    formatearCantidad: formatearCantidad
  };
});
