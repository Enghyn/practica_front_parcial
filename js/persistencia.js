// Persistencia en localStorage de la Librería Aurora (Ejercicio 6).
// Una clave por entidad más una bandera de versión:
// - si la bandera falta o no coincide con la versión de la aplicación, se
//   vuelve a sembrar con los datos de ejemplo;
// - si coincide, se restaura cada entidad por separado, de modo que un dato
//   corrupto en una clave no rompe la aplicación ni afecta a las demás.
// Si el navegador bloquea el almacenamiento (modo privado, políticas de
// file://), la aplicación sigue funcionando en memoria y avisa por texto.
(function () {
  'use strict';

  var CLAVES = {
    version: 'libreriaAurora:version',
    libros: 'libreriaAurora:libros',
    clientes: 'libreriaAurora:clientes',
    ventas: 'libreriaAurora:ventas'
  };

  // Versión del formato guardado: cambiarla invalida los datos anteriores.
  var VERSION_ACTUAL = '1';

  var almacenamiento = null;
  var disponible = true;
  var motivoFallo = '';

  // Devuelve el objeto localStorage, o null si el navegador lo bloquea.
  function obtenerAlmacenamiento() {
    if (almacenamiento) return almacenamiento;

    try {
      var clavePrueba = '__libreriaAurora_prueba__';
      window.localStorage.setItem(clavePrueba, '1');
      window.localStorage.removeItem(clavePrueba);
      almacenamiento = window.localStorage;
    } catch (error) {
      disponible = false;
      motivoFallo = 'el navegador bloqueó el almacenamiento local (modo privado o política del protocolo file://)';
    }

    return almacenamiento;
  }

  function estaDisponible() {
    return obtenerAlmacenamiento() !== null;
  }

  // Estado de una clave de colección: 'ausente' | 'invalido' | 'ok'.
  // Solo se considera válido un JSON que además sea un arreglo.
  function estado(clave) {
    var almacen = obtenerAlmacenamiento();
    if (!almacen) return { estado: 'ausente', valor: null };

    var texto = null;
    try {
      texto = almacen.getItem(clave);
    } catch (error) {
      return { estado: 'invalido', valor: null };
    }

    if (texto === null || texto === undefined) return { estado: 'ausente', valor: null };

    try {
      var valor = JSON.parse(texto);
      if (!Array.isArray(valor)) return { estado: 'invalido', valor: null };
      return { estado: 'ok', valor: valor };
    } catch (error) {
      return { estado: 'invalido', valor: null };
    }
  }

  // Devuelve el arreglo guardado, o null si no está, no se puede interpretar
  // o no tiene la forma esperada.
  function leer(clave) {
    var resultado = estado(clave);
    return resultado.estado === 'ok' ? resultado.valor : null;
  }

  function leerVersion() {
    var almacen = obtenerAlmacenamiento();
    if (!almacen) return null;

    try {
      return almacen.getItem(CLAVES.version);
    } catch (error) {
      return null;
    }
  }

  function escribirVersion() {
    var almacen = obtenerAlmacenamiento();
    if (!almacen) return false;

    try {
      almacen.setItem(CLAVES.version, VERSION_ACTUAL);
      return true;
    } catch (error) {
      disponible = false;
      motivoFallo = 'el navegador bloqueó la escritura del almacenamiento local';
      mostrarAviso('Aviso: no se pudieron guardar los datos porque ' + motivoFallo +
        '. La aplicación sigue funcionando en memoria.');
      return false;
    }
  }

  // Serializa el estado completo en las tres claves de colección.
  // Las claves ajenas al proyecto no se tocan.
  function escribir() {
    var almacen = obtenerAlmacenamiento();
    if (!almacen) return false;

    var datos = window.LibreriaDatos;
    if (!datos) return false;

    try {
      almacen.setItem(CLAVES.libros, JSON.stringify(datos.libros || []));
      almacen.setItem(CLAVES.clientes, JSON.stringify(datos.clientes || []));
      almacen.setItem(CLAVES.ventas, JSON.stringify(datos.ventas || []));
      return true;
    } catch (error) {
      disponible = false;
      motivoFallo = 'el navegador bloqueó la escritura del almacenamiento local';
      mostrarAviso('Aviso: no se pudieron guardar los datos porque ' + motivoFallo +
        '. La aplicación sigue funcionando en memoria.');
      return false;
    }
  }

  // Muestra un aviso de texto (sin depender de estilos ni de colores).
  function mostrarAviso(texto) {
    var aviso = document.getElementById('aviso-persistencia');
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.hidden = false;
  }

  window.LibreriaPersistencia = {
    CLAVES: CLAVES,
    VERSION_ACTUAL: VERSION_ACTUAL,
    estaDisponible: estaDisponible,
    estado: estado,
    leer: leer,
    leerVersion: leerVersion,
    escribirVersion: escribirVersion,
    escribir: escribir,
    mostrarAviso: mostrarAviso,
    motivoFallo: function () { return motivoFallo; }
  };
})();
