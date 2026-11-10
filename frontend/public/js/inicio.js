(function () {
  'use strict';

  // Arranque ordenado de las vistas. Cada módulo expone iniciar() y resuelve sus
  // propios estados de carga y error; acá solo se los dispara y se registra un
  // fallo inesperado para no dejar la página en silencio.
  function avisarFallo(error) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('[libreria] Falló el arranque de una vista', error);
    }
  }

  function iniciarModulo(nombre) {
    var modulo = window[nombre];
    if (!modulo || typeof modulo.iniciar !== 'function') {
      avisarFallo(new Error('El módulo ' + nombre + ' no está disponible'));
      return null;
    }
    try {
      return Promise.resolve(modulo.iniciar());
    } catch (error) {
      avisarFallo(error);
      return null;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    [
      iniciarModulo('LibreriaCatalogo'),
      iniciarModulo('LibreriaAltas'),
      iniciarModulo('LibreriaVentas'),
      iniciarModulo('LibreriaHistorial')
    ].forEach(function (promesa) {
      if (promesa && typeof promesa.catch === 'function') {
        promesa.catch(avisarFallo);
      }
    });
  });
})();
