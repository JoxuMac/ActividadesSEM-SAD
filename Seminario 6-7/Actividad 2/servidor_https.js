const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'ejs');


// routes
require('./carritoCompra.js')(app);

app.listen('3000', function() {
  console.log('Servidor web escuchando en el puerto 3000');
});