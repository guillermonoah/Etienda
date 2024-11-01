'use strict'

var express = require('express');
var clienteController = require('../controllers/ClienteController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_cliente',clienteController.registro_cliente);
api.post('/login_cliente',clienteController.login_cliente);

api.get('/listar_clientes_filtro_admin/:tipo/:filtro?',auth.auth,clienteController.listar_clientes_filtro_admin);
api.post('/registro_cliente_admin',auth.auth,clienteController.registro_cliente_admin);
api.get('/obtener_cliente_admin/:id',auth.auth,clienteController.obtener_cliente_admin);
api.put('/actualizar_cliente_admin/:id',auth.auth,clienteController.actualizar_cliente_admin);
api.delete('/eliminar_cliente_admin/:id',auth.auth,clienteController.eliminar_cliente_admin);

module.exports = api;