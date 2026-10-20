// Venta simulada e historial de la Librería Aurora (Ejercicio 5).
// Compone renglones, valida al confirmar y registra el historial inmutable:
// el precio unitario se copia al renglón al confirmarse la venta y el
// historial jamás vuelve a leer el precio del catálogo.
(function () {
  'use strict';

  var datos = window.LibreriaDatos;
  if (!datos) {
    console.error('Error: window.LibreriaDatos no está definido.');
    return;
  }

  // Renglones de la venta en curso: solo libroId y el texto de la cantidad.
  // El precio y el título se copian del catálogo recién al confirmar.
  var renglonesEnCurso = [];

  // Elementos del DOM - Formulario de venta
  var formVenta = document.getElementById('formulario-venta');
  var selectCliente = document.getElementById('venta-cliente');
  var selectLibro = document.getElementById('venta-libro');
  var inputCantidad = document.getElementById('venta-cantidad');
  var botonAgregarRenglon = document.getElementById('boton-agregar-renglon');
  var botonConfirmarVenta = document.getElementById('boton-confirmar-venta');
  var cuerpoRenglones = document.getElementById('cuerpo-renglones');
  var totalVenta = document.getElementById('total-venta');
  var mensajeRenglonesVacio = document.getElementById('mensaje-renglones-vacio');
  var mensajeExitoVenta = document.getElementById('mensaje-exito-venta');
  var mensajeErrorVenta = document.getElementById('mensaje-error-venta');

  // Elementos del DOM - Historial
  var cuerpoVentas = document.getElementById('cuerpo-ventas');
  var mensajeHistorialVacio = document.getElementById('mensaje-historial-vacio');
  var detalleVenta = document.getElementById('detalle-venta');
  var detalleVentaResumen = document.getElementById('detalle-venta-resumen');
  var cuerpoDetalleVenta = document.getElementById('cuerpo-detalle-venta');
  var detalleVentaTotal = document.getElementById('detalle-venta-total');

  // Auxiliar para crear celdas con texto seguro (evita XSS)
  function crearTd(texto) {
    var td = document.createElement('td');
    td.textContent = texto;
    return td;
  }

  // Importes siempre con dos decimales y prefijo de moneda.
  function formatearImporte(valor) {
    return '$ ' + Number(valor).toFixed(2);
  }

  function formatearFecha(iso) {
    var fecha = new Date(iso);
    if (isNaN(fecha.getTime())) return iso;
    return fecha.toLocaleString('es-AR');
  }

  // La cantidad debe ser un número entero mayor que cero; devuelve null si no lo es.
  function parsearCantidad(texto) {
    var valor = Number(String(texto == null ? '' : texto).trim());
    if (!isFinite(valor) || Math.floor(valor) !== valor || valor <= 0) {
      return null;
    }
    return valor;
  }

  function buscarLibroPorId(id) {
    return datos.libros.find(function (libro) { return libro.id === id; });
  }

  function buscarClientePorId(id) {
    return datos.clientes.find(function (cliente) { return cliente.id === id; });
  }

  // Muestra mensajes de error o éxito con texto seguro (evita XSS)
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

  function ocultarMensajesDeVenta() {
    if (mensajeExitoVenta) mensajeExitoVenta.hidden = true;
    if (mensajeErrorVenta) mensajeErrorVenta.hidden = true;
  }

  // 1. Agregar un renglón a la venta en curso
  function agregarRenglon() {
    var libroId = selectLibro ? selectLibro.value : '';
    var libro = buscarLibroPorId(libroId);
    var cantidad = parsearCantidad(inputCantidad ? inputCantidad.value : '');
    var errores = [];

    if (!libro) {
      errores.push('Debe elegir un libro del catálogo.');
    }

    if (cantidad === null) {
      errores.push('La cantidad debe ser un número entero mayor que cero.');
    }

    if (libro && renglonesEnCurso.some(function (r) { return r.libroId === libroId; })) {
      errores.push('El libro "' + libro.titulo + '" ya tiene un renglón en esta venta; modificá su cantidad en la tabla.');
    }

    if (errores.length > 0) {
      mostrarMensaje(mensajeExitoVenta, mensajeErrorVenta, false, 'Operación rechazada: ' + errores.join(' '));
      return;
    }

    renglonesEnCurso.push({ libroId: libroId, cantidadTexto: String(cantidad) });

    renderizarRenglones();
    ocultarMensajesDeVenta();

    // Dejar el formulario listo para el próximo renglón.
    if (selectLibro) selectLibro.value = '';
    if (inputCantidad) inputCantidad.value = '';
    if (selectLibro) selectLibro.focus();
  }

  // 2. Renderizado de los renglones de la venta en curso
  function renderizarRenglones() {
    if (!cuerpoRenglones) return;

    cuerpoRenglones.replaceChildren();

    renglonesEnCurso.forEach(function (renglon, indice) {
      var libro = buscarLibroPorId(renglon.libroId);
      var titulo = libro ? libro.titulo : 'Libro no disponible';
      var precio = libro ? Number(libro.precio) : 0;
      var cantidad = parsearCantidad(renglon.cantidadTexto);

      var tr = document.createElement('tr');
      tr.appendChild(crearTd(titulo));

      // Cantidad editable dentro de la propia fila.
      var tdCantidad = document.createElement('td');
      var inputFila = document.createElement('input');
      inputFila.type = 'number';
      inputFila.className = 'campo__control tabla__cantidad';
      inputFila.min = '1';
      inputFila.step = '1';
      inputFila.value = renglon.cantidadTexto;
      inputFila.dataset.indice = String(indice);
      inputFila.setAttribute('aria-label', 'Cantidad de ' + titulo);
      if (cantidad === null) {
        inputFila.setAttribute('aria-invalid', 'true');
      }
      tdCantidad.appendChild(inputFila);
      tr.appendChild(tdCantidad);

      tr.appendChild(crearTd(formatearImporte(precio)));
      tr.appendChild(crearTd(cantidad === null ? '—' : formatearImporte(cantidad * precio)));

      var tdAcciones = document.createElement('td');
      var botonQuitar = document.createElement('button');
      botonQuitar.type = 'button';
      botonQuitar.className = 'boton boton--secundario';
      botonQuitar.textContent = 'Quitar renglón';
      botonQuitar.dataset.quitarIndice = String(indice);
      tdAcciones.appendChild(botonQuitar);
      tr.appendChild(tdAcciones);

      cuerpoRenglones.appendChild(tr);
    });

    actualizarTotalRenglones();

    if (mensajeRenglonesVacio) {
      mensajeRenglonesVacio.hidden = renglonesEnCurso.length > 0;
    }
  }

  // El total solo se muestra si todas las cantidades son válidas.
  function actualizarTotalRenglones() {
    if (!totalVenta) return;

    var total = 0;
    var hayInvalida = renglonesEnCurso.some(function (renglon) {
      var cantidad = parsearCantidad(renglon.cantidadTexto);
      if (cantidad === null) return true;
      var libro = buscarLibroPorId(renglon.libroId);
      total += cantidad * (libro ? Number(libro.precio) : 0);
      return false;
    });

    totalVenta.textContent = hayInvalida ? '—' : formatearImporte(total);
  }

  // 3. Confirmación de la venta: valida, copia el precio y registra el historial
  function confirmarVenta() {
    var errores = [];
    var cliente = buscarClientePorId(selectCliente ? selectCliente.value : '');

    if (!cliente) {
      errores.push('Debe seleccionar un cliente.');
    }

    if (renglonesEnCurso.length === 0) {
      errores.push('La venta debe tener al menos un renglón.');
    }

    var pendientes = [];
    renglonesEnCurso.forEach(function (renglon, indice) {
      var cantidad = parsearCantidad(renglon.cantidadTexto);
      if (cantidad === null) {
        errores.push('El renglón ' + (indice + 1) + ' tiene una cantidad inválida: debe ser un número entero mayor que cero.');
        return;
      }
      var libro = buscarLibroPorId(renglon.libroId);
      if (!libro) {
        errores.push('El renglón ' + (indice + 1) + ' referencia un libro inexistente en el catálogo.');
        return;
      }
      pendientes.push({ libro: libro, cantidad: cantidad });
    });

    if (errores.length > 0) {
      mostrarMensaje(mensajeExitoVenta, mensajeErrorVenta, false, 'Operación rechazada: ' + errores.join(' '));
      return;
    }

    // Copia histórica: título y precio unitario se copian del catálogo AL
    // CONFIRMARSE la venta, en objetos nuevos. A partir de acá el historial
    // nunca más consulta datos.libros: el detalle es inmutable.
    var renglonesGuardados = pendientes.map(function (item) {
      var precioUnitario = Number(item.libro.precio);
      return {
        libroId: item.libro.id,
        titulo: item.libro.titulo,
        cantidad: item.cantidad,
        precioUnitario: precioUnitario,
        subtotal: item.cantidad * precioUnitario
      };
    });

    var total = renglonesGuardados.reduce(function (suma, r) { return suma + r.subtotal; }, 0);

    var venta = {
      id: 'venta-' + (datos.ventas.length + 1),
      fecha: new Date().toISOString(),
      clienteId: cliente.id,
      // Copia de los datos del cliente al momento de confirmar.
      cliente: { id: cliente.id, nombre: cliente.nombre, email: cliente.email },
      renglones: renglonesGuardados,
      total: total
    };

    datos.ventas.push(venta);

    // Guardar la venta en localStorage (Ejercicio 6). El renglón ya guarda su
    // copia histórica de precio, así que el historial no relee el catálogo.
    if (window.LibreriaPersistencia) window.LibreriaPersistencia.escribir();

    renderizarHistorial();

    // Limpiar el formulario para una nueva venta.
    renglonesEnCurso = [];
    renderizarRenglones();
    if (formVenta) formVenta.reset();
    ocultarMensajesDeVenta();

    mostrarMensaje(
      mensajeExitoVenta,
      mensajeErrorVenta,
      true,
      'Operación correcta: la venta "' + venta.id + '" se confirmó por ' + formatearImporte(total) +
      ' y quedó registrada en el historial.'
    );
  }

  // 4. Renderizado del historial de ventas
  function renderizarHistorial() {
    if (!cuerpoVentas) return;

    cuerpoVentas.replaceChildren();

    datos.ventas.forEach(function (venta) {
      var tr = document.createElement('tr');
      tr.appendChild(crearTd(venta.id));
      tr.appendChild(crearTd(formatearFecha(venta.fecha)));
      tr.appendChild(crearTd(venta.cliente.nombre));
      tr.appendChild(crearTd(formatearImporte(venta.total)));

      var tdDetalle = document.createElement('td');
      var botonDetalle = document.createElement('button');
      botonDetalle.type = 'button';
      botonDetalle.className = 'boton boton--secundario';
      botonDetalle.textContent = 'Ver detalle';
      botonDetalle.dataset.ventaId = venta.id;
      tdDetalle.appendChild(botonDetalle);
      tr.appendChild(tdDetalle);

      cuerpoVentas.appendChild(tr);
    });

    if (mensajeHistorialVacio) {
      mensajeHistorialVacio.hidden = datos.ventas.length > 0;
    }
  }

  // 5. Detalle de una venta: se arma SOLO con los datos guardados en la venta.
  // No se consulta el catálogo: el precio unitario es el histórico copiado.
  function verDetalle(ventaId) {
    var venta = datos.ventas.find(function (v) { return v.id === ventaId; });
    if (!venta || !cuerpoDetalleVenta) return;

    cuerpoDetalleVenta.replaceChildren();

    venta.renglones.forEach(function (renglon) {
      var tr = document.createElement('tr');
      tr.appendChild(crearTd(renglon.titulo));
      tr.appendChild(crearTd(String(renglon.cantidad)));
      tr.appendChild(crearTd(formatearImporte(renglon.precioUnitario)));
      tr.appendChild(crearTd(formatearImporte(renglon.subtotal)));
      cuerpoDetalleVenta.appendChild(tr);
    });

    if (detalleVentaTotal) {
      detalleVentaTotal.textContent = formatearImporte(venta.total);
    }

    if (detalleVentaResumen) {
      detalleVentaResumen.textContent = 'Detalle de la venta ' + venta.id + ' — ' +
        venta.cliente.nombre + ' — ' + formatearFecha(venta.fecha);
    }

    if (detalleVenta) {
      detalleVenta.open = true;
    }
  }

  // 6. Eventos

  if (botonAgregarRenglon) {
    botonAgregarRenglon.addEventListener('click', agregarRenglon);
  }

  if (botonConfirmarVenta) {
    botonConfirmarVenta.addEventListener('click', confirmarVenta);
  }

  // El formulario no tiene envío propio: Enter no debe recargar la página.
  if (formVenta) {
    formVenta.addEventListener('submit', function (evento) {
      evento.preventDefault();
    });
  }

  // Edición de cantidades y quitar renglones dentro de la tabla.
  if (cuerpoRenglones) {
    cuerpoRenglones.addEventListener('input', function (evento) {
      var destino = evento.target;
      if (!destino.classList || !destino.classList.contains('tabla__cantidad')) return;

      var indice = Number(destino.dataset.indice);
      var renglon = renglonesEnCurso[indice];
      if (!renglon) return;

      renglon.cantidadTexto = destino.value;
      var cantidad = parsearCantidad(destino.value);

      if (cantidad === null) {
        destino.setAttribute('aria-invalid', 'true');
      } else {
        destino.removeAttribute('aria-invalid');
      }

      // Actualizar solo el subtotal de esta fila y el total, sin re-render
      // completo: así no se pierde el foco del campo que se está escribiendo.
      var libro = buscarLibroPorId(renglon.libroId);
      var precio = libro ? Number(libro.precio) : 0;
      var fila = destino.closest('tr');
      if (fila && fila.children[3]) {
        fila.children[3].textContent = cantidad === null ? '—' : formatearImporte(cantidad * precio);
      }
      actualizarTotalRenglones();
    });

    cuerpoRenglones.addEventListener('click', function (evento) {
      var boton = evento.target.closest('button[data-quitar-indice]');
      if (!boton) return;
      var indice = Number(boton.dataset.quitarIndice);
      renglonesEnCurso.splice(indice, 1);
      renderizarRenglones();
    });
  }

  // Botón "Ver detalle" del historial.
  if (cuerpoVentas) {
    cuerpoVentas.addEventListener('click', function (evento) {
      var boton = evento.target.closest('button[data-venta-id]');
      if (!boton) return;
      verDetalle(boton.dataset.ventaId);
    });
  }

  // Las ventas guardadas en el curso no dependen del catálogo, pero los
  // títulos y precios mostrados en los renglones sí: se refrescan al cambiar
  // los datos locales (por ejemplo, un alta de libro nueva).
  document.addEventListener('libreria:datos-actualizados', function () {
    renderizarRenglones();
  });

  // Inicialización
  renderizarRenglones();
  renderizarHistorial();
})();
