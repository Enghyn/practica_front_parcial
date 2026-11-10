'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const nucleo = require('../public/js/nucleo.js');

test('ajustarLimite normaliza al rango 1..100', () => {
  assert.equal(nucleo.ajustarLimite(50), 50);
  assert.equal(nucleo.ajustarLimite(0), 1);
  assert.equal(nucleo.ajustarLimite(-10), 1);
  assert.equal(nucleo.ajustarLimite(500), 100);
  assert.equal(nucleo.ajustarLimite(20.9), 20);
  assert.equal(nucleo.ajustarLimite('20'), 20);
  assert.equal(nucleo.ajustarLimite(undefined), 20);
  assert.equal(nucleo.ajustarLimite(NaN), 20);
  assert.equal(nucleo.ajustarLimite(Infinity), 20);
});

test('ajustarOffset normaliza a entero mayor o igual a cero', () => {
  assert.equal(nucleo.ajustarOffset(0), 0);
  assert.equal(nucleo.ajustarOffset(40), 40);
  assert.equal(nucleo.ajustarOffset(-5), 0);
  assert.equal(nucleo.ajustarOffset(2.9), 2);
  assert.equal(nucleo.ajustarOffset('10'), 10);
  assert.equal(nucleo.ajustarOffset(undefined), 0);
  assert.equal(nucleo.ajustarOffset(NaN), 0);
});

test('construirConsulta devuelve cadena vacía sin parámetros útiles', () => {
  assert.equal(nucleo.construirConsulta(), '');
  assert.equal(nucleo.construirConsulta({}), '');
  assert.equal(
    nucleo.construirConsulta({ limit: '', offset: null, titulo: '', genero_id: undefined }),
    ''
  );
  assert.equal(nucleo.construirConsulta({ titulo: '   ' }), '');
});

test('construirConsulta respeta el orden fijo y codifica acentos y espacios', () => {
  assert.equal(
    nucleo.construirConsulta({ limit: 20, offset: 0, titulo: 'cien años', genero_id: 2 }),
    '?limit=20&offset=0&titulo=cien%20a%C3%B1os&genero_id=2'
  );
  assert.equal(
    nucleo.construirConsulta({ genero_id: 3, titulo: '  Cien años  ' }),
    '?titulo=Cien%20a%C3%B1os&genero_id=3'
  );
  assert.equal(
    nucleo.construirConsulta({ titulo: '100% café' }),
    '?titulo=100%25%20caf%C3%A9'
  );
});

test('construirConsulta ajusta límites fuera de rango y conserva el offset cero', () => {
  assert.equal(nucleo.construirConsulta({ limit: 0 }), '?limit=1');
  assert.equal(nucleo.construirConsulta({ limit: 500 }), '?limit=100');
  assert.equal(nucleo.construirConsulta({ offset: 0 }), '?offset=0');
  assert.equal(nucleo.construirConsulta({ offset: -3 }), '?offset=0');
  assert.equal(nucleo.construirConsulta({ genero_id: 0 }), '?genero_id=0');
});

test('calcularPaginacion describe primera, intermedia, última y vacía', () => {
  assert.deepEqual(
    nucleo.calcularPaginacion({ offset: 0, limit: 20, recibidos: 20 }),
    { anterior: false, siguiente: true, desde: 1, hasta: 20 }
  );

  assert.deepEqual(
    nucleo.calcularPaginacion({ offset: 20, limit: 20, recibidos: 20 }),
    { anterior: true, siguiente: true, desde: 21, hasta: 40 }
  );

  assert.deepEqual(
    nucleo.calcularPaginacion({ offset: 40, limit: 20, recibidos: 7 }),
    { anterior: true, siguiente: false, desde: 41, hasta: 47 }
  );

  assert.deepEqual(
    nucleo.calcularPaginacion({ offset: 40, limit: 20, recibidos: 0 }),
    { anterior: true, siguiente: false, desde: 0, hasta: 40 }
  );
});

test('normalizarId devuelve cadena limpia o vacía', () => {
  assert.equal(nucleo.normalizarId(null), '');
  assert.equal(nucleo.normalizarId(undefined), '');
  assert.equal(nucleo.normalizarId(''), '');
  assert.equal(nucleo.normalizarId('   '), '');
  assert.equal(nucleo.normalizarId(0), '0');
  assert.equal(nucleo.normalizarId(12), '12');
  assert.equal(nucleo.normalizarId('  7  '), '7');
});

test('aNumero convierte valores numéricos y rechaza vacíos', () => {
  assert.equal(nucleo.aNumero('1500.50'), 1500.5);
  assert.equal(nucleo.aNumero(1500), 1500);
  assert.equal(nucleo.aNumero('  '), NaN);
  assert.equal(nucleo.aNumero(''), NaN);
  assert.equal(nucleo.aNumero(null), NaN);
  assert.equal(nucleo.aNumero('abc'), NaN);
});

test('normalizarImporte devuelve número finito o null', () => {
  assert.equal(nucleo.normalizarImporte('1500.00'), 1500);
  assert.equal(nucleo.normalizarImporte('1500.50'), 1500.5);
  assert.equal(nucleo.normalizarImporte(1500), 1500);
  assert.equal(nucleo.normalizarImporte('0'), 0);
  assert.equal(nucleo.normalizarImporte(''), null);
  assert.equal(nucleo.normalizarImporte('   '), null);
  assert.equal(nucleo.normalizarImporte('basura'), null);
  assert.equal(nucleo.normalizarImporte(null), null);
  assert.equal(nucleo.normalizarImporte(undefined), null);
  assert.equal(nucleo.normalizarImporte(NaN), null);
  assert.equal(nucleo.normalizarImporte(Infinity), null);
});

test('normalizarLibro completa editorial, género y autores', () => {
  const libro = nucleo.normalizarLibro({
    id: 1,
    isbn: '978-1',
    titulo: 'Cien años de soledad',
    precio: '1500.00',
    stock: 10,
    editorial_id: 1,
    genero_id: 2,
    editorial: { id: 1, nombre: 'Sudamericana', pais: 'Argentina' },
    genero: { id: 2, nombre: 'Novela' },
  });

  assert.equal(libro.id, '1');
  assert.equal(libro.titulo, 'Cien años de soledad');
  assert.equal(libro.precioNumero, 1500);
  assert.equal(libro.stockNumero, 10);
  assert.equal(libro.editorialNombre, 'Sudamericana');
  assert.equal(libro.generoNombre, 'Novela');
  assert.deepEqual(libro.autores, []);
});

test('normalizarLibro usa etiquetas por defecto cuando faltan relaciones', () => {
  const libro = nucleo.normalizarLibro({
    id: '7',
    titulo: 'Sin datos',
    precio: null,
    stock: '4',
    editorial: null,
    genero: null,
  });

  assert.equal(libro.id, '7');
  assert.equal(libro.precioNumero, null);
  assert.equal(libro.stockNumero, 4);
  assert.equal(libro.editorialNombre, 'Desconocida');
  assert.equal(libro.generoNombre, 'Sin clasificar');
});

test('normalizarLibro normaliza las autorías cuando vienen', () => {
  const libro = nucleo.normalizarLibro({
    id: 3,
    titulo: 'Rayuela',
    autores: [
      { autor_id: 5, rol: 'autor', orden: 1, autor_nombre: 'Julio Cortázar' },
      { autor_id: 6, rol: 'traductor', orden: 2, autor_nombre: '' },
    ],
  });

  assert.deepEqual(libro.autores, [
    { autorId: '5', rol: 'autor', orden: 1, nombre: 'Julio Cortázar' },
    { autorId: '6', rol: 'traductor', orden: 2, nombre: 'Autor 6' },
  ]);
});

test('normalizarAutoria aplica valores por defecto', () => {
  assert.deepEqual(
    nucleo.normalizarAutoria({ autor_id: 9, rol: 'ilustrador', orden: 3, autor_nombre: 'Elena' }),
    { autorId: '9', rol: 'ilustrador', orden: 3, nombre: 'Elena' }
  );

  assert.deepEqual(nucleo.normalizarAutoria({ autor_id: 10, rol: 'autor', orden: 1 }), {
    autorId: '10',
    rol: 'autor',
    orden: 1,
    nombre: 'Autor 10',
  });
});

test('normalizarVenta y normalizarRenglon respetan el contrato', () => {
  const venta = nucleo.normalizarVenta({
    id: 1,
    cliente_id: 2,
    fecha: '2026-11-10T12:00:00-03:00',
    total: '5000.00',
    cliente: { id: 2, nombre: 'Ana Pérez', email: 'ana@example.com' },
    renglones: [
      {
        id: 1,
        venta_id: 1,
        libro_id: 1,
        cantidad: 2,
        precio_unitario: '1500.00',
        titulo: 'Cien años de soledad',
        subtotal: '3000.00',
      },
    ],
  });

  assert.equal(venta.id, '1');
  assert.equal(venta.clienteId, '2');
  assert.equal(venta.totalNumero, 5000);
  assert.equal(venta.clienteNombre, 'Ana Pérez');
  assert.deepEqual(venta.renglones, [
    {
      libroId: '1',
      titulo: 'Cien años de soledad',
      cantidad: 2,
      precioUnitarioNumero: 1500,
      subtotalNumero: 3000,
    },
  ]);

  const ventaSinCliente = nucleo.normalizarVenta({
    id: 5,
    cliente_id: 9,
    fecha: '2026-11-10T12:00:00-03:00',
    total: '0.00',
  });

  assert.equal(ventaSinCliente.clienteNombre, 'Cliente 9');
  assert.deepEqual(ventaSinCliente.renglones, []);
});

test('normalizarRenglon usa el título de reemplazo', () => {
  assert.deepEqual(nucleo.normalizarRenglon({ libro_id: 4, cantidad: 1 }), {
    libroId: '4',
    titulo: 'Libro 4',
    cantidad: 1,
    precioUnitarioNumero: null,
    subtotalNumero: null,
  });
});

test('mensajeDeError prioriza red, luego detail y luego el estado', () => {
  assert.equal(
    nucleo.mensajeDeError({ estado: null, cuerpo: null, red: true }),
    'No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 409, cuerpo: { detail: '  El ISBN ya existe  ' } }),
    'El ISBN ya existe'
  );

  assert.equal(
    nucleo.mensajeDeError({
      estado: 422,
      cuerpo: {
        detail: [
          { loc: ['body', 'stock'], msg: 'El campo no está permitido', type: 'extra_forbidden' },
          { loc: ['body', 'precio'], msg: 'El campo no está permitido', type: 'extra_forbidden' },
          { loc: ['body', 'titulo'], msg: 'El título es obligatorio', type: 'missing' },
        ],
      },
    }),
    'El campo no está permitido; El título es obligatorio'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 422, cuerpo: { detail: [{ loc: ['body'], type: 'x' }] } }),
    'Los datos enviados no son válidos.'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 404, cuerpo: null }),
    'El recurso solicitado no existe.'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 500, cuerpo: { detail: 'No se pudo completar la operación' } }),
    'No se pudo completar la operación'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 503, cuerpo: null }),
    'El servidor no pudo completar la operación. Intentá de nuevo más tarde.'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 409, cuerpo: null }),
    'La operación entra en conflicto con datos existentes.'
  );

  assert.equal(
    nucleo.mensajeDeError({ estado: 400, cuerpo: null }),
    'No se pudo completar la operación.'
  );
});

test('rolValido acepta únicamente los roles del contrato', () => {
  assert.equal(nucleo.rolValido('autor'), true);
  assert.equal(nucleo.rolValido('coautor'), true);
  assert.equal(nucleo.rolValido('traductor'), true);
  assert.equal(nucleo.rolValido('ilustrador'), true);
  assert.equal(nucleo.rolValido('editor'), false);
  assert.equal(nucleo.rolValido('Autor'), false);
  assert.equal(nucleo.rolValido(''), false);
  assert.equal(nucleo.rolValido(null), false);
});

test('recolectarPaginas acumula una única página corta', async () => {
  const llamadas = [];
  const resultado = await nucleo.recolectarPaginas(async (parametros) => {
    llamadas.push(parametros);
    return [1, 2, 3];
  });

  assert.deepEqual(resultado, [1, 2, 3]);
  assert.deepEqual(llamadas, [{ limit: 20, offset: 0 }]);
});

test('recolectarPaginas acumula páginas llenas hasta la corta', async () => {
  const llamadas = [];
  const paginas = [[1, 2], [3, 4], [5]];

  const resultado = await nucleo.recolectarPaginas(
    async ({ limit, offset }) => {
      llamadas.push({ limit, offset });
      return paginas[offset / limit] || [];
    },
    { limit: 2 }
  );

  assert.deepEqual(resultado, [1, 2, 3, 4, 5]);
  assert.deepEqual(llamadas, [
    { limit: 2, offset: 0 },
    { limit: 2, offset: 2 },
    { limit: 2, offset: 4 },
  ]);
});

test('recolectarPaginas respeta maxPaginas y tolera páginas vacías', async () => {
  let llamadas = 0;
  const resultado = await nucleo.recolectarPaginas(
    async () => {
      llamadas += 1;
      return [1, 2];
    },
    { limit: 2, maxPaginas: 2 }
  );

  assert.deepEqual(resultado, [1, 2, 1, 2]);
  assert.equal(llamadas, 2);

  let llamadasVacias = 0;
  const vacio = await nucleo.recolectarPaginas(async () => {
    llamadasVacias += 1;
    return [];
  });

  assert.deepEqual(vacio, []);
  assert.equal(llamadasVacias, 1);
});
