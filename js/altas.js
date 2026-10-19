// Alta de libros y clientes de la Librería Aurora (Ejercicio 4).
// Maneja la validación, alta y renderizado en vivo para libros y clientes.
(function () {
  'use strict';

  var datos = window.LibreriaDatos;
  if (!datos) {
    console.error('Error: window.LibreriaDatos no está definido.');
    return;
  }

  // Elementos del DOM - Libros
  var formLibro = document.getElementById('formulario-alta-libro');
  var inputTitulo = document.getElementById('libro-titulo');
  var inputIsbn = document.getElementById('libro-isbn');
  var inputPrecio = document.getElementById('libro-precio');
  var selectEditorial = document.getElementById('libro-editorial');
  var selectGenero = document.getElementById('libro-genero');
  var selectAutores = document.getElementById('libro-autores');
  var mensajeExitoLibro = document.getElementById('mensaje-exito-libro');
  var mensajeErrorLibro = document.getElementById('mensaje-error-libro');
  var cuerpoLibros = document.getElementById('cuerpo-libros');
  var mensajeLibrosVacio = document.getElementById('mensaje-libros-vacio');

  // Elementos del DOM - Clientes
  var formCliente = document.getElementById('formulario-alta-cliente');
  var inputClienteNombre = document.getElementById('cliente-nombre');
  var inputClienteEmail = document.getElementById('cliente-email');
  var mensajeExitoCliente = document.getElementById('mensaje-exito-cliente');
  var mensajeErrorCliente = document.getElementById('mensaje-error-cliente');
  var cuerpoClientes = document.getElementById('cuerpo-clientes');
  var mensajeClientesVacio = document.getElementById('mensaje-clientes-vacio');

  // Elementos del DOM - Ventas (selectores relacionados)
  var selectVentaCliente = document.getElementById('venta-cliente');
  var selectVentaLibro = document.getElementById('venta-libro');

  // Auxiliar para crear celdas con texto seguro (evita XSS)
  function crearTd(texto) {
    var td = document.createElement('td');
    td.textContent = texto;
    return td;
  }

  // Normaliza el ISBN removiendo espacios y guiones para comparación
  function normalizarISBN(isbn) {
    return String(isbn || '').replace(/[\s-]/g, '');
  }

  // 1. Poblado de selectores según los datos locales
  function poblarSelects() {
    // Editorial
    if (selectEditorial) {
      selectEditorial.replaceChildren();
      var optEdDefault = document.createElement('option');
      optEdDefault.value = '';
      optEdDefault.textContent = 'Elegí una editorial';
      selectEditorial.appendChild(optEdDefault);

      datos.editoriales.forEach(function (ed) {
        var opt = document.createElement('option');
        opt.value = ed.id;
        opt.textContent = ed.nombre;
        selectEditorial.appendChild(opt);
      });
    }

    // Género
    if (selectGenero) {
      selectGenero.replaceChildren();
      var optGenDefault = document.createElement('option');
      optGenDefault.value = '';
      optGenDefault.textContent = 'Sin clasificar';
      selectGenero.appendChild(optGenDefault);

      datos.generos.forEach(function (gen) {
        var opt = document.createElement('option');
        opt.value = gen.id;
        opt.textContent = gen.nombre;
        selectGenero.appendChild(opt);
      });
    }

    // Autores (múltiple)
    if (selectAutores) {
      selectAutores.replaceChildren();
      datos.autores.forEach(function (aut) {
        var opt = document.createElement('option');
        opt.value = aut.id;
        opt.textContent = aut.nombre;
        selectAutores.appendChild(opt);
      });
    }

    // Selector de clientes en Ventas (si está en el DOM)
    if (selectVentaCliente) {
      var clienteSeleccionado = selectVentaCliente.value;
      selectVentaCliente.replaceChildren();
      var optCliDefault = document.createElement('option');
      optCliDefault.value = '';
      optCliDefault.textContent = 'Elegí un cliente';
      selectVentaCliente.appendChild(optCliDefault);

      datos.clientes.forEach(function (cli) {
        var opt = document.createElement('option');
        opt.value = cli.id;
        opt.textContent = cli.nombre + ' (' + cli.email + ')';
        selectVentaCliente.appendChild(opt);
      });
      selectVentaCliente.value = clienteSeleccionado;
    }

    // Selector de libros en Ventas (si está en el DOM)
    if (selectVentaLibro) {
      var libroSeleccionado = selectVentaLibro.value;
      selectVentaLibro.replaceChildren();
      var optLibDefault = document.createElement('option');
      optLibDefault.value = '';
      optLibDefault.textContent = 'Elegí un libro';
      selectVentaLibro.appendChild(optLibDefault);

      datos.libros.forEach(function (lib) {
        var opt = document.createElement('option');
        opt.value = lib.id;
        opt.textContent = lib.titulo + ' ($ ' + Number(lib.precio).toFixed(2) + ')';
        selectVentaLibro.appendChild(opt);
      });
      selectVentaLibro.value = libroSeleccionado;
    }
  }

  // 2. Renderizado del listado de Libros Registrados
  function renderizarTablaLibros() {
    if (!cuerpoLibros) return;

    var editorialesPorId = new Map(datos.editoriales.map(function (e) { return [e.id, e.nombre]; }));
    var generosPorId = new Map(datos.generos.map(function (g) { return [g.id, g.nombre]; }));
    var autoresPorId = new Map(datos.autores.map(function (a) { return [a.id, a.nombre]; }));

    cuerpoLibros.replaceChildren();

    datos.libros.forEach(function (libro) {
      var tr = document.createElement('tr');

      tr.appendChild(crearTd(libro.titulo));
      tr.appendChild(crearTd(libro.isbn));
      tr.appendChild(crearTd(editorialesPorId.get(libro.editorialId) || 'Desconocida'));
      tr.appendChild(crearTd(libro.generoId ? (generosPorId.get(libro.generoId) || 'Sin clasificar') : 'Sin clasificar'));

      var nombresAutores = (libro.autorIds || [])
        .map(function (id) { return autoresPorId.get(id); })
        .filter(Boolean)
        .join(', ');
      tr.appendChild(crearTd(nombresAutores || 'Desconocido'));

      tr.appendChild(crearTd('$ ' + Number(libro.precio).toFixed(2)));

      cuerpoLibros.appendChild(tr);
    });

    if (mensajeLibrosVacio) {
      mensajeLibrosVacio.hidden = datos.libros.length > 0;
    }
  }

  // 3. Renderizado del listado de Clientes Registrados
  function renderizarTablaClientes() {
    if (!cuerpoClientes) return;

    cuerpoClientes.replaceChildren();

    datos.clientes.forEach(function (cliente) {
      var tr = document.createElement('tr');
      tr.appendChild(crearTd(cliente.nombre));
      tr.appendChild(crearTd(cliente.email));
      cuerpoClientes.appendChild(tr);
    });

    if (mensajeClientesVacio) {
      mensajeClientesVacio.hidden = datos.clientes.length > 0;
    }
  }

  // Muestra mensajes de error o éxito con accesibilidad y texto seguro
  function mostrarMensaje(elementoExito, elementoError, esExito, texto) {
    if (esExito) {
      if (elementoError) elementoError.hidden = true;
      if (elementoExito) {
        var pExito = elementoExito.querySelector('.mensaje__texto') || elementoExito;
        pExito.textContent = texto;
        elementoExito.hidden = false;
      }
    } else {
      if (elementoExito) elementoExito.hidden = true;
      if (elementoError) {
        var pError = elementoError.querySelector('.mensaje__texto') || elementoError;
        pError.textContent = texto;
        elementoError.hidden = false;
      }
    }
  }

  // 4. Alta de Libro - Event Listener
  if (formLibro) {
    formLibro.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var titulo = (inputTitulo ? inputTitulo.value : '').trim();
      var isbn = (inputIsbn ? inputIsbn.value : '').trim();
      var precioTexto = (inputPrecio ? inputPrecio.value : '').trim();
      var precio = parseFloat(precioTexto);
      var editorialId = selectEditorial ? selectEditorial.value : '';
      var generoId = selectGenero ? selectGenero.value : '';
      var autorOptions = selectAutores ? Array.from(selectAutores.selectedOptions) : [];
      var autorIds = autorOptions.map(function (opt) { return opt.value; });

      var errores = [];

      // Validaciones obligatorias de libros
      if (!titulo) {
        errores.push('El título no puede estar vacío.');
      }

      if (!isbn) {
        errores.push('El ISBN no puede estar vacío.');
      } else {
        var isbnNorm = normalizarISBN(isbn);
        var isbnExiste = datos.libros.some(function (l) {
          return normalizarISBN(l.isbn) === isbnNorm;
        });
        if (isbnExiste) {
          errores.push('El ISBN ingresado ya existe en el sistema.');
        }
      }

      if (!precioTexto || isNaN(precio) || precio <= 0) {
        errores.push('El precio debe ser un número mayor que cero.');
      }

      if (!editorialId) {
        errores.push('Debe seleccionar una editorial.');
      } else {
        var editorialExiste = datos.editoriales.some(function (e) { return e.id === editorialId; });
        if (!editorialExiste) {
          errores.push('La editorial seleccionada no existe en los datos locales.');
        }
      }

      if (autorIds.length === 0) {
        errores.push('Debe seleccionar al menos un autor.');
      } else {
        var autoresValidos = autorIds.every(function (id) {
          return datos.autores.some(function (a) { return a.id === id; });
        });
        if (!autoresValidos) {
          errores.push('Uno o más autores seleccionados no existen en los datos locales.');
        }
      }

      if (generoId) {
        var generoExiste = datos.generos.some(function (g) { return g.id === generoId; });
        if (!generoExiste) {
          errores.push('El género seleccionado no existe en los datos locales.');
        }
      }

      if (errores.length > 0) {
        mostrarMensaje(mensajeExitoLibro, mensajeErrorLibro, false, 'Operación rechazada: ' + errores.join(' '));
        return;
      }

      // Alta válida
      var nuevoLibro = {
        id: 'lib' + (datos.libros.length + 1) + '_' + Date.now(),
        titulo: titulo,
        isbn: isbn,
        precio: precio,
        editorialId: editorialId,
        generoId: generoId || null,
        autorIds: autorIds
      };

      datos.libros.push(nuevoLibro);

      renderizarTablaLibros();
      poblarSelects();

      // Notificar al catálogo para actualizar la vista en vivo
      document.dispatchEvent(new CustomEvent('libreria:datos-actualizados'));

      mostrarMensaje(
        mensajeExitoLibro,
        mensajeErrorLibro,
        true,
        'Operación correcta: el libro "' + titulo + '" se registró exitosamente.'
      );

      formLibro.reset();
    });
  }

  // 5. Alta de Cliente - Event Listener
  if (formCliente) {
    formCliente.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var nombre = (inputClienteNombre ? inputClienteNombre.value : '').trim();
      var email = (inputClienteEmail ? inputClienteEmail.value : '').trim();

      var errores = [];

      if (!nombre) {
        errores.push('El nombre completo no puede estar vacío.');
      }

      if (!email) {
        errores.push('El correo electrónico no puede estar vacío.');
      } else {
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
          errores.push('El correo electrónico no tiene un formato válido.');
        } else {
          var emailNorm = email.toLowerCase();
          var emailExiste = datos.clientes.some(function (c) {
            return String(c.email || '').trim().toLowerCase() === emailNorm;
          });
          if (emailExiste) {
            errores.push('Ya existe un cliente registrado con ese correo electrónico.');
          }
        }
      }

      if (errores.length > 0) {
        mostrarMensaje(mensajeExitoCliente, mensajeErrorCliente, false, 'Operación rechazada: ' + errores.join(' '));
        return;
      }

      // Alta válida
      var nuevoCliente = {
        id: 'cli' + (datos.clientes.length + 1) + '_' + Date.now(),
        nombre: nombre,
        email: email
      };

      datos.clientes.push(nuevoCliente);

      renderizarTablaClientes();
      poblarSelects();

      mostrarMensaje(
        mensajeExitoCliente,
        mensajeErrorCliente,
        true,
        'Operación correcta: el cliente "' + nombre + '" se registró exitosamente.'
      );

      formCliente.reset();
    });
  }

  // Inicialización
  poblarSelects();
  renderizarTablaLibros();
  renderizarTablaClientes();
})();
