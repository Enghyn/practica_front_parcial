'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const formato = require('../public/js/formato.js');

test('formatearImporte usa dos decimales con punto y sin separador de miles', () => {
  assert.equal(formato.formatearImporte('1500.00'), '$ 1500.00');
  assert.equal(formato.formatearImporte('1500.5'), '$ 1500.50');
  assert.equal(formato.formatearImporte(1500), '$ 1500.00');
  assert.equal(formato.formatearImporte(0), '$ 0.00');
  assert.equal(formato.formatearImporte('1234567.891'), '$ 1234567.89');
});

test('formatearImporte muestra un guion largo cuando no hay importe válido', () => {
  assert.equal(formato.formatearImporte(null), '—');
  assert.equal(formato.formatearImporte(undefined), '—');
  assert.equal(formato.formatearImporte(''), '—');
  assert.equal(formato.formatearImporte('   '), '—');
  assert.equal(formato.formatearImporte('basura'), '—');
  assert.equal(formato.formatearImporte(Infinity), '—');
});

test('formatearFecha convierte un ISO válido y marca los inválidos', () => {
  const fecha = formato.formatearFecha('2026-11-10T15:30:00-03:00');
  assert.notEqual(fecha, '—');
  assert.match(fecha, /2026/);

  assert.equal(formato.formatearFecha('no-es-una-fecha'), '—');
  assert.equal(formato.formatearFecha(''), '—');
  assert.equal(formato.formatearFecha(null), '—');
  assert.equal(formato.formatearFecha(undefined), '—');
});

test('formatearCantidad devuelve el entero como texto', () => {
  assert.equal(formato.formatearCantidad(0), '0');
  assert.equal(formato.formatearCantidad(3), '3');
  assert.equal(formato.formatearCantidad(3.9), '3');
  assert.equal(formato.formatearCantidad('4'), '4');
});
