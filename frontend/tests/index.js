'use strict';

// Carga los archivos de prueba del directorio.
// Node 24 no expande un directorio pasado a `node --test`, por lo que este
// índice permite que `node --test tests` y `npm test` funcionen igual.
const fs = require('node:fs');
const path = require('node:path');

const archivos = fs
  .readdirSync(__dirname)
  .filter(function (archivo) {
    return archivo.endsWith('.test.js');
  })
  .sort();

archivos.forEach(function (archivo) {
  require(path.join(__dirname, archivo));
});
