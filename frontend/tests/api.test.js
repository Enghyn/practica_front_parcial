'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const CONFIG = { API_BASE: '/api', LIMITE: 20, TIMEOUT_MS: 10000 };
globalThis.LIBRERIA_CONFIG = CONFIG;

const api = require('../public/js/api.js');

const fetchOriginal = globalThis.fetch;

function instalarFetch(simulado) {
  globalThis.fetch = simulado;
  return function restaurar() {
    globalThis.fetch = fetchOriginal;
  };
}

function respuestaJson(datos, estado) {
  return {
    ok: estado >= 200 && estado < 300,
    status: estado,
    json: async () => {
      if (datos === undefined) throw new SyntaxError('Cuerpo vacío');
      return datos;
    },
  };
}

test('obtenerLibros arma la URL exacta, headers y devuelve estado', async () => {
  let llamada = null;
  const restaurar = instalarFetch(async (url, opciones) => {
    llamada = { url, opciones };
    return respuestaJson([{ id: 1 }], 200);
  });

  try {
    const resultado = await api.obtenerLibros({
      limit: 20,
      offset: 40,
      titulo: 'cien años',
      genero_id: 2,
    });

    assert.equal(
      llamada.url,
      '/api/libros/?limit=20&offset=40&titulo=cien%20a%C3%B1os&genero_id=2'
    );
    assert.equal(llamada.opciones.method, 'GET');
    assert.equal(llamada.opciones.headers.Accept, 'application/json');
    assert.equal(llamada.opciones.headers['Content-Type'], undefined);
    assert.equal(llamada.opciones.body, undefined);
    assert.deepEqual(resultado, { datos: [{ id: 1 }], estado: 200 });
  } finally {
    restaurar();
  }
});

test('obtenerLibros sin filtros conserva la barra final de la colección', async () => {
  let urlVista = '';
  const restaurar = instalarFetch(async (url) => {
    urlVista = url;
    return respuestaJson([], 200);
  });

  try {
    const resultado = await api.obtenerLibros();
    assert.equal(urlVista, '/api/libros/');
    assert.deepEqual(resultado, { datos: [], estado: 200 });
  } finally {
    restaurar();
  }
});

test('las rutas de colección y detalle respetan la barra final', async () => {
  const urls = [];
  const restaurar = instalarFetch(async (url) => {
    urls.push(url);
    return respuestaJson({}, 200);
  });

  try {
    await api.obtenerLibro(7);
    await api.obtenerEditoriales({ limit: 100, offset: 0 });
    await api.obtenerGeneros();
    await api.obtenerAutor(3);
    await api.obtenerVentas({ limit: 20, offset: 20 });
    await api.obtenerVenta(9);
    await api.estadoSalud();

    assert.deepEqual(urls, [
      '/api/libros/7',
      '/api/editoriales/?limit=100&offset=0',
      '/api/generos/',
      '/api/autores/3',
      '/api/ventas/?limit=20&offset=20',
      '/api/ventas/9',
      '/api/health/ready',
    ]);
  } finally {
    restaurar();
  }
});

test('pedir normaliza rutas sin barra inicial', async () => {
  let urlVista = '';
  const restaurar = instalarFetch(async (url) => {
    urlVista = url;
    return respuestaJson({}, 200);
  });

  try {
    await api.pedir('libros/');
    assert.equal(urlVista, '/api/libros/');
  } finally {
    restaurar();
  }
});

test('crearLibro envía POST con JSON y propaga el estado 201', async () => {
  let llamada = null;
  const dto = {
    isbn: '978-1',
    titulo: 'Cien años de soledad',
    precio: 1500,
    stock: 10,
    editorial_id: 1,
    genero_id: 2,
    autores: [{ autor_id: 5, rol: 'autor', orden: 1 }],
  };
  const cuerpoRespuesta = { id: 1, ...dto, precio: '1500.00' };

  const restaurar = instalarFetch(async (url, opciones) => {
    llamada = { url, opciones };
    return respuestaJson(cuerpoRespuesta, 201);
  });

  try {
    const resultado = await api.crearLibro(dto);

    assert.equal(llamada.url, '/api/libros/');
    assert.equal(llamada.opciones.method, 'POST');
    assert.equal(llamada.opciones.headers.Accept, 'application/json');
    assert.equal(llamada.opciones.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(llamada.opciones.body), dto);
    assert.equal(resultado.estado, 201);
    assert.deepEqual(resultado.datos, cuerpoRespuesta);
  } finally {
    restaurar();
  }
});

test('crearCliente y crearVenta usan el contrato exacto', async () => {
  const llamadas = [];
  const restaurar = instalarFetch(async (url, opciones) => {
    llamadas.push({ url, opciones });
    return respuestaJson({ id: 1 }, 201);
  });

  try {
    const cliente = await api.crearCliente({ nombre: 'Ana', email: 'ana@example.com' });
    const venta = await api.crearVenta({
      cliente_id: 2,
      renglones: [{ libro_id: 1, cantidad: 2 }],
    });

    assert.equal(cliente.estado, 201);
    assert.equal(venta.estado, 201);
    assert.equal(llamadas[0].url, '/api/clientes/');
    assert.deepEqual(JSON.parse(llamadas[0].opciones.body), {
      nombre: 'Ana',
      email: 'ana@example.com',
    });
    assert.equal(llamadas[1].url, '/api/ventas/');
    assert.deepEqual(JSON.parse(llamadas[1].opciones.body), {
      cliente_id: 2,
      renglones: [{ libro_id: 1, cantidad: 2 }],
    });
  } finally {
    restaurar();
  }
});

test('un 409 produce ErrorApi con mensaje traducido y estado', async () => {
  const restaurar = instalarFetch(async () =>
    respuestaJson({ detail: 'El ISBN ya existe' }, 409)
  );

  try {
    await assert.rejects(api.crearLibro({}), (error) => {
      assert.ok(error instanceof api.ErrorApi);
      assert.equal(error.name, 'ErrorApi');
      assert.equal(error.message, 'El ISBN ya existe');
      assert.equal(error.estado, 409);
      assert.equal(error.red, false);
      assert.equal(error.detalles, null);
      return true;
    });
  } finally {
    restaurar();
  }
});

test('un 422 con detail array une mensajes únicos', async () => {
  const detalle = [
    { loc: ['body', 'stock'], msg: 'El campo no está permitido', type: 'extra_forbidden' },
    { loc: ['body', 'precio'], msg: 'El campo no está permitido', type: 'extra_forbidden' },
    { loc: ['body', 'titulo'], msg: 'El título es obligatorio', type: 'missing' },
  ];
  const restaurar = instalarFetch(async () => respuestaJson({ detail: detalle }, 422));

  try {
    await assert.rejects(api.crearLibro({}), (error) => {
      assert.ok(error instanceof api.ErrorApi);
      assert.equal(
        error.message,
        'El campo no está permitido; El título es obligatorio'
      );
      assert.equal(error.estado, 422);
      assert.deepEqual(error.detalles, detalle);
      return true;
    });
  } finally {
    restaurar();
  }
});

test('un 422 con detail string usa el texto de la API', async () => {
  const restaurar = instalarFetch(async () =>
    respuestaJson({ detail: 'El precio debe ser mayor a cero' }, 422)
  );

  try {
    await assert.rejects(api.obtenerLibros(), (error) => {
      assert.equal(error.message, 'El precio debe ser mayor a cero');
      assert.equal(error.estado, 422);
      return true;
    });
  } finally {
    restaurar();
  }
});

test('un 404 sin cuerpo usa el mensaje de recurso inexistente', async () => {
  const restaurar = instalarFetch(async () =>
    respuestaJson(undefined, 404)
  );

  try {
    await assert.rejects(api.obtenerLibro(99), (error) => {
      assert.ok(error instanceof api.ErrorApi);
      assert.equal(error.message, 'El recurso solicitado no existe.');
      assert.equal(error.estado, 404);
      assert.equal(error.detalles, null);
      return true;
    });
  } finally {
    restaurar();
  }
});

test('un 500 con cuerpo usa el detalle y sin cuerpo el mensaje genérico', async () => {
  let restaurar = instalarFetch(async () =>
    respuestaJson({ detail: 'No se pudo completar la operación' }, 500)
  );

  try {
    await assert.rejects(api.obtenerLibros(), (error) => {
      assert.equal(error.message, 'No se pudo completar la operación');
      assert.equal(error.estado, 500);
      return true;
    });
  } finally {
    restaurar();
  }

  restaurar = instalarFetch(async () => respuestaJson(undefined, 500));

  try {
    await assert.rejects(api.obtenerLibros(), (error) => {
      assert.equal(
        error.message,
        'El servidor no pudo completar la operación. Intentá de nuevo más tarde.'
      );
      return true;
    });
  } finally {
    restaurar();
  }
});

test('una falla de red produce ErrorApi con red true y estado null', async () => {
  const restaurar = instalarFetch(async () => {
    throw new TypeError('Failed to fetch');
  });

  try {
    await assert.rejects(api.obtenerLibros(), (error) => {
      assert.ok(error instanceof api.ErrorApi);
      assert.equal(error.red, true);
      assert.equal(error.estado, null);
      assert.equal(
        error.message,
        'No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.'
      );
      return true;
    });
  } finally {
    restaurar();
  }
});

test('un 204 devuelve datos null', async () => {
  let urlVista = '';
  const restaurar = instalarFetch(async (url) => {
    urlVista = url;
    return {
      ok: true,
      status: 204,
      json: async () => {
        throw new SyntaxError('Sin contenido');
      },
    };
  });

  try {
    const resultado = await api.pedir('/sin-contenido');
    assert.equal(urlVista, '/api/sin-contenido');
    assert.deepEqual(resultado, { datos: null, estado: 204 });
  } finally {
    restaurar();
  }
});

test('un timeout se informa como error de red', async () => {
  const timeoutOriginal = CONFIG.TIMEOUT_MS;
  CONFIG.TIMEOUT_MS = 25;

  const restaurar = instalarFetch((url, opciones) => {
    return new Promise((resolve, reject) => {
      opciones.signal.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  });

  try {
    await assert.rejects(api.obtenerLibros(), (error) => {
      assert.ok(error instanceof api.ErrorApi);
      assert.equal(error.red, true);
      return true;
    });
  } finally {
    restaurar();
    CONFIG.TIMEOUT_MS = timeoutOriginal;
  }
});

test('un abort externo relanza el AbortError original', async () => {
  const controlador = new AbortController();
  const restaurar = instalarFetch((url, opciones) => {
    return new Promise((resolve, reject) => {
      if (opciones.signal.aborted) {
        reject(new DOMException('Operación cancelada', 'AbortError'));
        return;
      }
      opciones.signal.addEventListener('abort', () => {
        reject(new DOMException('Operación cancelada', 'AbortError'));
      });
    });
  });

  try {
    controlador.abort();
    await assert.rejects(
      api.pedir('/libros/', { senal: controlador.signal }),
      (error) => {
        assert.equal(error.name, 'AbortError');
        assert.equal(error instanceof api.ErrorApi, false);
        return true;
      }
    );
  } finally {
    restaurar();
  }
});

test('si fetch no existe lanza un error descriptivo', async () => {
  globalThis.fetch = undefined;

  try {
    await assert.rejects(api.obtenerLibros(), /fetch/i);
  } finally {
    globalThis.fetch = fetchOriginal;
  }
});

test('cargarTodasEditoriales y cargarTodosGeneros recorren las páginas', async () => {
  const editoriales = Array.from({ length: 103 }, (_, indice) => ({
    id: indice + 1,
    nombre: 'Editorial ' + (indice + 1),
  }));
  const generos = Array.from({ length: 3 }, (_, indice) => ({
    id: indice + 1,
    nombre: 'Género ' + (indice + 1),
  }));

  const urls = [];
  const restaurar = instalarFetch(async (url) => {
    urls.push(url);
    const partes = new URL(url, 'http://localhost');
    const offset = Number(partes.searchParams.get('offset') || 0);
    const limit = Number(partes.searchParams.get('limit') || 20);

    if (url.indexOf('/api/editoriales/') === 0) {
      return respuestaJson(editoriales.slice(offset, offset + limit), 200);
    }
    return respuestaJson(generos.slice(offset, offset + limit), 200);
  });

  try {
    const resultadoEditoriales = await api.cargarTodasEditoriales();
    const resultadoGeneros = await api.cargarTodosGeneros();

    assert.equal(resultadoEditoriales.datos.length, 103);
    assert.equal(resultadoEditoriales.estado, 200);
    assert.equal(resultadoGeneros.datos.length, 3);
    assert.deepEqual(urls, [
      '/api/editoriales/?limit=20&offset=0',
      '/api/editoriales/?limit=20&offset=20',
      '/api/editoriales/?limit=20&offset=40',
      '/api/editoriales/?limit=20&offset=60',
      '/api/editoriales/?limit=20&offset=80',
      '/api/editoriales/?limit=20&offset=100',
      '/api/generos/?limit=20&offset=0',
    ]);
  } finally {
    restaurar();
  }
});
