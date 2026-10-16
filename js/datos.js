// Datos locales iniciales de la Librería Aurora (Ejercicio 3).
// Solo datos en memoria: sin fetch, sin localStorage (eso es del Ejercicio 6).
(function () {
  'use strict';

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
  var clientes = [
    { id: 'cli1', nombre: 'Ana Pérez', email: 'ana.perez@ejemplo.com' },
    { id: 'cli2', nombre: 'Bruno Díaz', email: 'bruno.diaz@ejemplo.com' },
    { id: 'cli3', nombre: 'Carla Gómez', email: 'carla.gomez@ejemplo.com' }
  ];

  var libros = [
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

  // Único global del change: los changes de Ej. 4/5 reutilizan este objeto.
  window.LibreriaDatos = {
    editoriales: editoriales,
    generos: generos,
    autores: autores,
    clientes: clientes,
    libros: libros
  };
})();
