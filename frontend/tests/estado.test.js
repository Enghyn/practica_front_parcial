'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const api = require('../public/js/api.js');
const estado = require('../public/js/estado.js');

test('cargarOpciones llena editoriales y géneros en memoria', async () => {
  const originales = {
    cargarTodasEditoriales: api.cargarTodasEditoriales,
    cargarTodosGeneros: api.cargarTodosGeneros,
  };

  api.cargarTodasEditoriales = async () => ({
    datos: [{ id: 1, nombre: 'Sudamericana', pais: 'Argentina' }],
    estado: 200,
  });
  api.cargarTodosGeneros = async () => ({
    datos: [{ id: 2, nombre: 'Novela' }],
    estado: 200,
  });

  try {
    const resultado = await estado.cargarOpciones();

    assert.deepEqual(estado.datos.editoriales, [
      { id: 1, nombre: 'Sudamericana', pais: 'Argentina' },
    ]);
    assert.deepEqual(estado.datos.generos, [{ id: 2, nombre: 'Novela' }]);
    assert.deepEqual(resultado, {
      editoriales: [{ id: 1, nombre: 'Sudamericana', pais: 'Argentina' }],
      generos: [{ id: 2, nombre: 'Novela' }],
    });
  } finally {
    api.cargarTodasEditoriales = originales.cargarTodasEditoriales;
    api.cargarTodosGeneros = originales.cargarTodosGeneros;
  }
});

test('cargarCatalogo normaliza, guarda el estado y emite el evento', async () => {
  const original = api.obtenerLibros;
  let parametrosVistos = null;
  const documentoOriginal = globalThis.document;
  const eventoOriginal = globalThis.CustomEvent;
  const eventos = [];

  api.obtenerLibros = async (parametros) => {
    parametrosVistos = parametros;
    return {
      datos: [
        {
          id: 1,
          isbn: '978-1',
          titulo: 'Cien años de soledad',
          precio: '1500.00',
          stock: 10,
          editorial: { id: 1, nombre: 'Sudamericana' },
          genero: null,
        },
        {
          id: 2,
          isbn: '978-2',
          titulo: 'Rayuela',
          precio: '2000.00',
          stock: 3,
          editorial: null,
          genero: { id: 2, nombre: 'Novela' },
        },
      ],
      estado: 200,
    };
  };

  globalThis.document = {
    dispatchEvent(evento) {
      eventos.push(evento);
    },
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(tipo, opciones) {
      this.type = tipo;
      this.detail = opciones.detail;
    }
  };

  try {
    const resultado = await estado.cargarCatalogo({ offset: 20, titulo: '  años  ' });

    assert.deepEqual(parametrosVistos, { limit: 20, offset: 20, titulo: 'años' });
    assert.equal(estado.datos.offset, 20);
    assert.equal(estado.datos.titulo, 'años');
    assert.equal(estado.datos.recibidos, 2);
    assert.equal(estado.datos.libros.length, 2);
    assert.equal(estado.datos.libros[0].id, '1');
    assert.equal(estado.datos.libros[0].precioNumero, 1500);
    assert.equal(estado.datos.libros[0].generoNombre, 'Sin clasificar');
    assert.equal(estado.datos.libros[1].editorialNombre, 'Desconocida');

    assert.equal(resultado.limite, 20);
    assert.equal(resultado.recibidos, 2);
    assert.equal(eventos.length, 1);
    assert.equal(eventos[0].type, 'libreria:catalogo');
    assert.deepEqual(eventos[0].detail, resultado);
  } finally {
    api.obtenerLibros = original;
    if (documentoOriginal === undefined) delete globalThis.document;
    else globalThis.document = documentoOriginal;
    if (eventoOriginal === undefined) delete globalThis.CustomEvent;
    else globalThis.CustomEvent = eventoOriginal;
  }
});

test('cargarAutoresDeLibro cachea por id y normaliza las autorías', async () => {
  const original = api.obtenerLibro;
  let llamadas = 0;
  estado.autoresPorLibro.clear();
  estado.autoresPorId.clear();

  api.obtenerLibro = async (id) => {
    llamadas += 1;
    assert.equal(id, '5');
    return {
      datos: {
        id: 5,
        titulo: 'Rayuela',
        autores: [
          { autor_id: 8, rol: 'autor', orden: 1, autor_nombre: 'Julio Cortázar' },
        ],
      },
      estado: 200,
    };
  };

  try {
    const primera = await estado.cargarAutoresDeLibro(5);
    const segunda = await estado.cargarAutoresDeLibro(' 5 ');

    assert.equal(llamadas, 1);
    assert.deepEqual(primera, [
      { autorId: '8', rol: 'autor', orden: 1, nombre: 'Julio Cortázar' },
    ]);
    assert.deepEqual(segunda, primera);
    assert.deepEqual(estado.autoresPorLibro.get('5'), primera);
    assert.equal(estado.obtenerAutor(8).nombre, 'Julio Cortázar');
  } finally {
    api.obtenerLibro = original;
  }
});

test('el estado recuerda clientes, autores y libros', () => {
  estado.clientesPorId.clear();
  estado.autoresPorId.clear();
  estado.datos.libros = [];

  const cliente = estado.recordarCliente({ id: 2, nombre: 'Ana', email: 'ana@example.com' });
  assert.equal(cliente.id, 2);
  assert.deepEqual(estado.obtenerCliente('2'), cliente);
  assert.equal(estado.obtenerCliente(99), null);
  assert.deepEqual(estado.clientesConocidos(), [cliente]);

  const autor = estado.recordarAutor({ id: 8, nombre: 'Julio Cortázar' });
  assert.equal(estado.obtenerAutor(8), autor);
  assert.equal(estado.obtenerAutor('julio cortázar'), autor);
  assert.equal(estado.obtenerAutor(99), null);

  estado.recordarLibro({ id: 1, titulo: 'Primero' });
  estado.recordarLibro({ id: 2, titulo: 'Segundo' });
  estado.recordarLibro({ id: 1, titulo: 'Primero actualizado' });

  assert.equal(estado.datos.libros.length, 2);
  assert.equal(estado.datos.libros[0].titulo, 'Primero actualizado');
  assert.equal(estado.datos.libros[1].titulo, 'Segundo');
});
