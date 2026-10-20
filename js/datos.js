// Datos locales de la Librería Aurora (Ejercicios 3 a 6).
// Los literales (editoriales, géneros, autores) son fijos en el código porque
// no se administran desde la interfaz. Los libros, clientes y ventas se
// siembran una sola vez y se conservan en localStorage (js/persistencia.js).
(function () {
  'use strict';

  var persistencia = window.LibreriaPersistencia;

  // Ids estables tipo cadena para referenciar entre arrays.
  var editoriales = [
    { id: 'ed1', nombre: 'Sudamericana' },
    { id: 'ed2', nombre: 'Planeta' }
  ];

  var generos = [
    { id: 'gen1', nombre: 'Novela' },
    { id: 'gen2', nombre: 'Poesía' }
  ];

  var autores = [
    { id: 'aut1', nombre: 'Gabriel García Márquez' },
    { id: 'aut2', nombre: 'Jorge Luis Borges' },
    { id: 'aut3', nombre: 'Alfonsina Storni' }
  ];

  // Clientes ficticios de ejemplo.
  var clientesSemilla = [
    { id: 'cli1', nombre: 'Ana Pérez', email: 'ana.perez@ejemplo.com' },
    { id: 'cli2', nombre: 'Bruno Díaz', email: 'bruno.diaz@ejemplo.com' },
    { id: 'cli3', nombre: 'Carla Gómez', email: 'carla.gomez@ejemplo.com' }
  ];

  var librosSemilla = [
    {
      id: 'lib1',
      titulo: 'Cien años de soledad',
      isbn: '978-950-07-0011-0',
      precio: 1500,
      editorialId: 'ed1',
      generoId: 'gen1',
      autorIds: ['aut1']
    },
    {
      id: 'lib2',
      titulo: 'Poemas de la soledad',
      isbn: '978-950-07-0012-7',
      precio: 2000,
      editorialId: 'ed2',
      generoId: 'gen2',
      autorIds: ['aut3']
    },
    {
      id: 'lib3',
      titulo: 'El amor en los tiempos del cólera',
      isbn: '978-950-07-0013-4',
      precio: 1800,
      editorialId: 'ed1',
      generoId: 'gen1',
      autorIds: ['aut1']
    },
    {
      id: 'lib4',
      titulo: 'El Aleph',
      isbn: '978-950-07-0014-1',
      precio: 1200,
      editorialId: 'ed2',
      generoId: null, // Sin género: se muestra como "Sin clasificar".
      autorIds: ['aut2']
    },
    {
      id: 'lib5',
      titulo: 'Ficciones',
      isbn: '978-950-07-0015-8',
      precio: 1350.5,
      editorialId: 'ed1',
      generoId: 'gen1',
      autorIds: ['aut2']
    },
    {
      id: 'lib6',
      titulo: 'Antología esencial',
      isbn: '978-950-07-0016-5',
      precio: 2100,
      editorialId: 'ed2',
      generoId: 'gen2',
      autorIds: ['aut2', 'aut3']
    }
  ];

  // Ventas confirmadas (Ejercicio 5): cada una copia el precio al renglón
  // al momento de confirmarse; el historial nunca relee el catálogo.
  var ventasSemilla = [];

  // Copia profunda de la semilla, para no compartir objetos con el código.
  function clonar(objetos) {
    return objetos.map(function (objeto) {
      return JSON.parse(JSON.stringify(objeto));
    });
  }

  var clientes = clonar(clientesSemilla);
  var libros = clonar(librosSemilla);
  var ventas = clonar(ventasSemilla);

  // Único global del change: los changes de Ej. 4/5/6 reutilizan este objeto.
  window.LibreriaDatos = {
    editoriales: editoriales,
    generos: generos,
    autores: autores,
    clientes: clientes,
    libros: libros,
    ventas: ventas
  };

  // Reemplaza el contenido del arreglo sin cambiar su identidad, para que
  // window.LibreriaDatos siga apuntando al mismo array.
  function reemplazarContenido(destino, origen) {
    destino.splice(0, destino.length);
    Array.prototype.push.apply(destino, origen);
  }

  // Siembra única o restauración, según la bandera de versión.
  function aplicarPersistencia() {
    if (!persistencia) return;

    if (!persistencia.estaDisponible()) {
      persistencia.mostrarAviso(
        'Aviso: no hay almacenamiento local disponible porque ' + persistencia.motivoFallo() +
        '. Los datos quedan solo en memoria y se pierden al cerrar la página.'
      );
      return;
    }

    // Bandera ausente o distinta: se vuelve a sembrar y se actualiza.
    if (persistencia.leerVersion() !== persistencia.VERSION_ACTUAL) {
      persistencia.escribir();
      persistencia.escribirVersion();
      return;
    }

    // La versión coincide: se restaura entidad por entidad.
    var entidades = [
      { etiqueta: 'libros', clave: persistencia.CLAVES.libros, destino: libros },
      { etiqueta: 'clientes', clave: persistencia.CLAVES.clientes, destino: clientes },
      { etiqueta: 'ventas', clave: persistencia.CLAVES.ventas, destino: ventas }
    ];
    var problemas = [];

    entidades.forEach(function (entidad) {
      var resultado = persistencia.estado(entidad.clave);

      if (resultado.estado === 'ok') {
        reemplazarContenido(entidad.destino, resultado.valor);
        return;
      }

      // Esa entidad conserva su semilla y se avisa por texto.
      if (resultado.estado === 'invalido') {
        problemas.push('el contenido guardado de ' + entidad.etiqueta + ' no se pudo interpretar');
      } else {
        problemas.push('no había datos guardados de ' + entidad.etiqueta);
      }
    });

    if (problemas.length > 0) {
      // Se reescribe el estado para dejar sanas las claves afectadas.
      persistencia.escribir();
      persistencia.mostrarAviso(
        'Aviso: ' + problemas.join('; ') + '. Se cargaron los datos de ejemplo de esas secciones ' +
        'y la aplicación sigue operativa.'
      );
    }
  }

  aplicarPersistencia();
})();
