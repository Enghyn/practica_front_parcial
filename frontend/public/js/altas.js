// Altas de libros y clientes contra la API, con verificación de autorías.
(function () {
  'use strict';

  var Nucleo = window.LibreriaNucleo;
  var Estado = window.LibreriaEstado;
  var Api = window.LibreriaApi;
  var Formato = window.LibreriaFormato;

  // Autorías del libro que se está registrando.
  var autorias = [];
  var enviandoLibro = false;
  var enviandoCliente = false;
  var iniciado = false;

  function porId(id) {
    return document.getElementById(id);
  }

  // Formulario de libro.
  var formLibro = porId('formulario-alta-libro');
  var inputTitulo = porId('libro-titulo');
  var inputIsbn = porId('libro-isbn');
  var inputPrecio = porId('libro-precio');
  var inputStock = porId('libro-stock');
  var selectEditorial = porId('libro-editorial');
  var selectGenero = porId('libro-genero');
  var inputAutorId = porId('autor-id');
  var selectAutorRol = porId('autor-rol');
  var inputAutorOrden = porId('autor-orden');
  var botonAgregarAutoria = porId('boton-agregar-autoria');
  var mensajeErrorAutoria = porId('mensaje-error-autoria');
  var cuerpoAutorias = porId('cuerpo-autorias');
  var mensajeAutoriasVacio = porId('mensaje-autorias-vacio');
  var botonAgregarLibro = porId('boton-agregar-libro');
  var mensajeExitoLibro = porId('mensaje-exito-libro');
  var mensajeErrorLibro = porId('mensaje-error-libro');
  var cuerpoLibros = porId('cuerpo-libros');
  var mensajeLibrosVacio = porId('mensaje-libros-vacio');

  // Formulario y búsqueda de clientes.
  var formCliente = porId('formulario-alta-cliente');
  var inputClienteNombre = porId('cliente-nombre');
  var inputClienteEmail = porId('cliente-email');
  var botonAgregarCliente = porId('boton-agregar-cliente');
  var mensajeExitoCliente = porId('mensaje-exito-cliente');
  var mensajeErrorCliente = porId('mensaje-error-cliente');
  var inputClienteBuscar = porId('cliente-buscar-id');
  var botonBuscarCliente = porId('boton-buscar-cliente');
  var mensajeErrorBusqueda = porId('mensaje-error-busqueda-cliente');
  var cuerpoClientes = porId('cuerpo-clientes');
  var mensajeClientesVacio = porId('mensaje-clientes-vacio');

  // Selector de clientes de la vista Ventas (si está presente).
  var selectVentaCliente = porId('venta-cliente');

  function mostrar(elemento) {
    if (elemento) elemento.hidden = false;
  }

  function ocultar(elemento) {
    if (elemento) elemento.hidden = true;
  }

  function parrafo(texto) {
    var elemento = document.createElement('p');
    elemento.className = 'mensaje__texto';
    elemento.textContent = texto;
    return elemento;
  }

  function mostrarMensaje(elemento, texto) {
    if (!elemento) return;
    elemento.replaceChildren(parrafo(texto));
    elemento.hidden = false;
  }

  // Un párrafo por error para que la lista se lea sin depender de white-space.
  function mostrarErrores(elemento, errores) {
    if (!elemento) return;
    elemento.replaceChildren();
    errores.forEach(function (texto) {
      elemento.appendChild(parrafo('• ' + texto));
    });
    elemento.hidden = false;
  }

  function textoDeError(error) {
    return error && typeof error.message === 'string' && error.message !== ''
      ? error.message
      : 'No se pudo completar la operación.';
  }

  function valorDe(elemento) {
    return elemento ? String(elemento.value == null ? '' : elemento.value).trim() : '';
  }

  function crearCelda(texto) {
    var celda = document.createElement('td');
    celda.textContent = texto === null || texto === undefined || texto === '' ? '—' : String(texto);
    return celda;
  }

  function poblarSelect(select, opciones, textoInicial) {
    if (!select) return;

    select.replaceChildren();
    var inicial = document.createElement('option');
    inicial.value = '';
    inicial.textContent = textoInicial;
    select.appendChild(inicial);

    (opciones || []).forEach(function (item) {
      var opcion = document.createElement('option');
      opcion.value = String(item.id);
      opcion.textContent = String(item.nombre);
      select.appendChild(opcion);
    });
  }

  function poblarSelectsEditorialGenero() {
    var datos = Estado && Estado.datos ? Estado.datos : {};
    poblarSelect(selectEditorial, datos.editoriales, 'Elegí una editorial');
    poblarSelect(selectGenero, datos.generos, 'Sin clasificar');
  }

  // El selector de venta conserva el cliente elegido si sigue disponible.
  function poblarSelectVentaCliente() {
    if (!selectVentaCliente) return;

    var seleccionado = selectVentaCliente.value;
    var clientes = Estado.clientesConocidos();

    selectVentaCliente.replaceChildren();
    var inicial = document.createElement('option');
    inicial.value = '';
    inicial.textContent = 'Elegí un cliente consultado';
    selectVentaCliente.appendChild(inicial);

    clientes.forEach(function (cliente) {
      var opcion = document.createElement('option');
      opcion.value = String(cliente.id);
      opcion.textContent = String(cliente.nombre) + ' (' + String(cliente.email) + ')';
      selectVentaCliente.appendChild(opcion);
    });

    selectVentaCliente.value = seleccionado;
  }

  function renderizarAutorias() {
    if (!cuerpoAutorias) return;

    cuerpoAutorias.replaceChildren();

    autorias.forEach(function (autoria, indice) {
      var fila = document.createElement('tr');
      fila.appendChild(crearCelda(autoria.nombre));
      fila.appendChild(crearCelda(autoria.autorId));
      fila.appendChild(crearCelda(autoria.rol));
      fila.appendChild(crearCelda(String(autoria.orden)));

      var acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'boton boton--secundario';
      boton.textContent = 'Quitar';
      boton.dataset.quitarAutoria = String(indice);
      acciones.appendChild(boton);
      fila.appendChild(acciones);

      cuerpoAutorias.appendChild(fila);
    });

    if (mensajeAutoriasVacio) mensajeAutoriasVacio.hidden = autorias.length > 0;
  }

  function renderizarTablaLibros(libros) {
    if (!cuerpoLibros) return;

    var lista = Array.isArray(libros)
      ? libros
      : (Estado && Estado.datos ? Estado.datos.libros : []);

    cuerpoLibros.replaceChildren();

    lista.forEach(function (libro) {
      var fila = document.createElement('tr');
      fila.appendChild(crearCelda(libro.titulo));
      fila.appendChild(crearCelda(libro.isbn));
      fila.appendChild(crearCelda(libro.editorialNombre));
      fila.appendChild(crearCelda(libro.generoNombre));
      fila.appendChild(crearCelda(Formato.formatearCantidad(libro.stockNumero)));
      fila.appendChild(crearCelda(Formato.formatearImporte(libro.precioNumero)));
      cuerpoLibros.appendChild(fila);
    });

    if (mensajeLibrosVacio) mensajeLibrosVacio.hidden = lista.length > 0;
  }

  function renderizarTablaClientes() {
    if (!cuerpoClientes) return;

    var clientes = Estado.clientesConocidos();
    cuerpoClientes.replaceChildren();

    clientes.forEach(function (cliente) {
      var fila = document.createElement('tr');
      fila.appendChild(crearCelda(cliente.id));
      fila.appendChild(crearCelda(cliente.nombre));
      fila.appendChild(crearCelda(cliente.email));
      cuerpoClientes.appendChild(fila);
    });

    if (mensajeClientesVacio) mensajeClientesVacio.hidden = clientes.length > 0;
  }

  function actualizarClientes() {
    renderizarTablaClientes();
    poblarSelectVentaCliente();
  }

  // Valida el formulario completo; las autorías se revalidan acá por las dudas.
  function validarLibro(datos) {
    var errores = [];
    var precio = Nucleo.aNumero(datos.precioTexto);
    var stock = Nucleo.aNumero(datos.stockTexto);

    if (datos.titulo === '') errores.push('El título no puede estar vacío.');
    if (datos.isbn === '') errores.push('El ISBN no puede estar vacío.');

    if (datos.precioTexto === '' || !Number.isFinite(precio) || precio <= 0) {
      errores.push('El precio debe ser un número mayor que cero.');
    }

    if (datos.stockTexto === '' ||
        !Number.isFinite(stock) ||
        !Number.isInteger(stock) ||
        stock < 0) {
      errores.push('El stock debe ser un número entero mayor o igual que cero.');
    }

    if (datos.editorialId === '') {
      errores.push('Elegí una editorial.');
    } else {
      var editoriales = Estado && Estado.datos ? Estado.datos.editoriales : [];
      var existe = (editoriales || []).some(function (editorial) {
        return String(editorial.id) === datos.editorialId;
      });
      if (!existe) errores.push('La editorial elegida no existe en el catálogo.');
    }

    if (autorias.length === 0) {
      errores.push('Agregá al menos una autoría.');
    } else {
      var vistos = {};
      autorias.forEach(function (autoria, indice) {
        var numero = indice + 1;
        var orden = Nucleo.aNumero(autoria.orden);

        if (!Nucleo.rolValido(autoria.rol)) {
          errores.push('La autoría ' + numero + ' tiene un rol inválido.');
        }

        if (!Number.isFinite(orden) || !Number.isInteger(orden) || orden < 1) {
          errores.push('La autoría ' + numero + ' debe tener un orden entero mayor o igual que 1.');
        }

        if (vistos[autoria.autorId]) {
          errores.push('El autor con ID ' + autoria.autorId + ' está repetido.');
        }
        vistos[autoria.autorId] = true;
      });
    }

    return errores;
  }

  async function agregarAutoria() {
    var idTexto = valorDe(inputAutorId);
    var idNumero = Nucleo.aNumero(idTexto);
    var rol = selectAutorRol ? selectAutorRol.value : '';
    var orden = Nucleo.aNumero(valorDe(inputAutorOrden));
    var idValido = idTexto !== '' &&
      Number.isFinite(idNumero) &&
      Number.isInteger(idNumero) &&
      idNumero >= 1;
    var idNormalizado = idValido ? String(idNumero) : '';
    var errores = [];

    if (!idValido) {
      errores.push('El ID del autor debe ser un número entero mayor o igual que 1.');
    }

    if (!Nucleo.rolValido(rol)) {
      errores.push('El rol elegido no es válido.');
    }

    if (!Number.isFinite(orden) || !Number.isInteger(orden) || orden < 1) {
      errores.push('El orden debe ser un número entero mayor o igual que 1.');
    }

    if (idValido && autorias.some(function (autoria) {
      return autoria.autorId === idNormalizado;
    })) {
      errores.push('Ese autor ya está agregado a la lista.');
    }

    if (errores.length > 0) {
      mostrarErrores(mensajeErrorAutoria, errores);
      return;
    }

    if (botonAgregarAutoria) {
      botonAgregarAutoria.disabled = true;
      botonAgregarAutoria.textContent = 'Verificando…';
    }

    try {
      var respuesta = await Api.obtenerAutor(idNormalizado);
      var autor = respuesta && respuesta.datos ? respuesta.datos : {};
      var autorId = autor.id !== undefined && autor.id !== null
        ? String(autor.id)
        : idNormalizado;
      var nombre = autor.nombre !== undefined && autor.nombre !== null
        ? autor.nombre
        : 'Autor ' + idNormalizado;

      Estado.recordarAutor(autor);
      autorias.push({ autorId: autorId, nombre: nombre, rol: rol, orden: orden });
      renderizarAutorias();

      if (inputAutorId) inputAutorId.value = '';
      if (inputAutorOrden) inputAutorOrden.value = String(autorias.length + 1);
      if (selectAutorRol) selectAutorRol.value = 'autor';

      ocultar(mensajeErrorAutoria);
      if (inputAutorId) inputAutorId.focus();
    } catch (error) {
      mostrarMensaje(mensajeErrorAutoria, textoDeError(error));
    } finally {
      if (botonAgregarAutoria) {
        botonAgregarAutoria.disabled = false;
        botonAgregarAutoria.textContent = 'Verificar y agregar';
      }
    }
  }

  async function enviarLibro(evento) {
    evento.preventDefault();
    if (enviandoLibro) return;

    var datos = {
      titulo: valorDe(inputTitulo),
      isbn: valorDe(inputIsbn),
      precioTexto: valorDe(inputPrecio),
      stockTexto: valorDe(inputStock),
      editorialId: valorDe(selectEditorial),
      generoId: valorDe(selectGenero)
    };

    var errores = validarLibro(datos);
    if (errores.length > 0) {
      ocultar(mensajeExitoLibro);
      mostrarErrores(mensajeErrorLibro, errores);
      return;
    }

    var precio = Nucleo.aNumero(datos.precioTexto);
    var stock = Nucleo.aNumero(datos.stockTexto);

    enviandoLibro = true;
    ocultar(mensajeExitoLibro);
    ocultar(mensajeErrorLibro);

    if (botonAgregarLibro) {
      botonAgregarLibro.disabled = true;
      botonAgregarLibro.textContent = 'Guardando…';
    }
    if (formLibro) formLibro.setAttribute('aria-busy', 'true');

    try {
      var respuesta = await Api.crearLibro({
        isbn: datos.isbn,
        titulo: datos.titulo,
        precio: precio,
        stock: stock,
        editorial_id: Number(datos.editorialId),
        genero_id: datos.generoId === '' ? null : Number(datos.generoId),
        autores: autorias.map(function (autoria) {
          return {
            autor_id: Number(autoria.autorId),
            rol: autoria.rol,
            orden: Number(autoria.orden)
          };
        })
      });

      var libro = respuesta && respuesta.datos ? respuesta.datos : {};
      var identificador = libro.id !== undefined && libro.id !== null ? libro.id : 'sin identificar';

      autorias = [];
      renderizarAutorias();
      if (formLibro) formLibro.reset();
      poblarSelectsEditorialGenero();
      ocultar(mensajeErrorAutoria);

      Estado.recordarLibro(Nucleo.normalizarLibro(libro));
      renderizarTablaLibros();
      mostrarMensaje(
        mensajeExitoLibro,
        'Libro registrado con el identificador ' + identificador + '.'
      );

      // El alta ya se completó: un fallo al refrescar no debe ocultar el éxito.
      try {
        await Estado.cargarCatalogo({ offset: 0, titulo: '' });
      } catch (errorCatalogo) {
        console.error('[libreria] El libro se registró, pero no se pudo refrescar el catálogo.', errorCatalogo);
      }
    } catch (error) {
      mostrarMensaje(mensajeErrorLibro, textoDeError(error));
    } finally {
      enviandoLibro = false;
      if (botonAgregarLibro) {
        botonAgregarLibro.disabled = false;
        botonAgregarLibro.textContent = 'Agregar libro';
      }
      if (formLibro) formLibro.setAttribute('aria-busy', 'false');
    }
  }

  async function enviarCliente(evento) {
    evento.preventDefault();
    if (enviandoCliente) return;

    var nombre = valorDe(inputClienteNombre);
    var email = valorDe(inputClienteEmail);
    var errores = [];
    var formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre === '') errores.push('El nombre no puede estar vacío.');
    if (email === '') {
      errores.push('El correo electrónico no puede estar vacío.');
    } else if (!formatoEmail.test(email)) {
      errores.push('El correo electrónico no tiene un formato válido.');
    }

    if (errores.length > 0) {
      ocultar(mensajeExitoCliente);
      mostrarErrores(mensajeErrorCliente, errores);
      return;
    }

    enviandoCliente = true;
    ocultar(mensajeExitoCliente);
    ocultar(mensajeErrorCliente);

    if (botonAgregarCliente) {
      botonAgregarCliente.disabled = true;
      botonAgregarCliente.textContent = 'Guardando…';
    }
    if (formCliente) formCliente.setAttribute('aria-busy', 'true');

    try {
      var respuesta = await Api.crearCliente({ nombre: nombre, email: email });
      var cliente = respuesta && respuesta.datos ? respuesta.datos : {};
      var identificador = cliente.id !== undefined && cliente.id !== null
        ? cliente.id
        : 'sin identificar';

      Estado.recordarCliente(cliente);
      document.dispatchEvent(new CustomEvent('libreria:clientes', {
        detail: { cliente: cliente }
      }));
      actualizarClientes();

      mostrarMensaje(
        mensajeExitoCliente,
        'Cliente registrado con el identificador ' + identificador + '.'
      );
      if (formCliente) formCliente.reset();
      if (inputClienteBuscar) inputClienteBuscar.value = '';
      ocultar(mensajeErrorBusqueda);
    } catch (error) {
      mostrarMensaje(mensajeErrorCliente, textoDeError(error));
    } finally {
      enviandoCliente = false;
      if (botonAgregarCliente) {
        botonAgregarCliente.disabled = false;
        botonAgregarCliente.textContent = 'Agregar cliente';
      }
      if (formCliente) formCliente.setAttribute('aria-busy', 'false');
    }
  }

  async function buscarCliente() {
    var texto = valorDe(inputClienteBuscar);
    var numero = Nucleo.aNumero(texto);

    if (texto === '' || !Number.isFinite(numero) || !Number.isInteger(numero) || numero < 1) {
      mostrarMensaje(
        mensajeErrorBusqueda,
        'El identificador debe ser un número entero mayor o igual que 1.'
      );
      return;
    }

    if (botonBuscarCliente) {
      botonBuscarCliente.disabled = true;
      botonBuscarCliente.textContent = 'Buscando…';
    }

    try {
      var respuesta = await Api.obtenerCliente(String(numero));
      var cliente = respuesta && respuesta.datos ? respuesta.datos : {};

      Estado.recordarCliente(cliente);
      document.dispatchEvent(new CustomEvent('libreria:clientes', {
        detail: { cliente: cliente }
      }));
      actualizarClientes();

      ocultar(mensajeErrorBusqueda);
      if (inputClienteBuscar) inputClienteBuscar.value = '';
    } catch (error) {
      mostrarMensaje(mensajeErrorBusqueda, textoDeError(error));
    } finally {
      if (botonBuscarCliente) {
        botonBuscarCliente.disabled = false;
        botonBuscarCliente.textContent = 'Buscar cliente';
      }
    }
  }

  function conectarEventos() {
    if (formLibro) {
      formLibro.addEventListener('submit', enviarLibro);
      formLibro.addEventListener('reset', function () {
        autorias = [];
        renderizarAutorias();
        ocultar(mensajeErrorAutoria);
      });
    }

    if (formCliente) {
      formCliente.addEventListener('submit', enviarCliente);
    }

    if (botonAgregarAutoria) {
      botonAgregarAutoria.addEventListener('click', agregarAutoria);
    }

    if (cuerpoAutorias) {
      cuerpoAutorias.addEventListener('click', function (evento) {
        var boton = evento.target && evento.target.closest
          ? evento.target.closest('button[data-quitar-autoria]')
          : null;
        if (!boton || !cuerpoAutorias.contains(boton)) return;

        var indice = Number(boton.dataset.quitarAutoria);
        if (!Number.isInteger(indice) || indice < 0 || indice >= autorias.length) return;

        autorias.splice(indice, 1);
        renderizarAutorias();
      });
    }

    if (botonBuscarCliente) {
      botonBuscarCliente.addEventListener('click', buscarCliente);
    }

    if (inputClienteBuscar) {
      inputClienteBuscar.addEventListener('keydown', function (evento) {
        if (evento.key !== 'Enter') return;
        evento.preventDefault();
        buscarCliente();
      });
    }

    document.addEventListener('libreria:catalogo', function (evento) {
      var detalle = evento && evento.detail ? evento.detail : {};
      renderizarTablaLibros(detalle.libros);
    });

    document.addEventListener('libreria:clientes', actualizarClientes);
  }

  async function iniciar() {
    if (iniciado) return;
    iniciado = true;

    if (!Nucleo || !Estado || !Api || !Formato) {
      console.error('[libreria] Faltan módulos para iniciar las altas.');
      return;
    }

    conectarEventos();
    renderizarAutorias();
    renderizarTablaClientes();
    renderizarTablaLibros(Estado.datos ? Estado.datos.libros : []);
    poblarSelectVentaCliente();

    if (botonAgregarLibro) {
      botonAgregarLibro.disabled = true;
      botonAgregarLibro.textContent = 'Agregar libro';
    }

    try {
      await Estado.cargarOpciones();
      poblarSelectsEditorialGenero();
      if (botonAgregarLibro) botonAgregarLibro.disabled = false;
    } catch (error) {
      mostrarMensaje(mensajeErrorLibro, textoDeError(error));
      if (botonAgregarLibro) botonAgregarLibro.disabled = true;
    }
  }

  window.LibreriaAltas = { iniciar: iniciar };
})();
