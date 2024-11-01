'use strict'

var express = require('express');
var productoController = require('../controllers/productoController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/productos'});

//productos
api.post('/registro_producto_admin',[auth.auth,path],productoController.registro_producto_admin);
api.get('/listar_producto_admin/:filtro?',auth.auth, productoController.listar_producto_admin);
api.get('/obtener_portada/:img',productoController.obtener_portada);
api.get('/obtener_producto_admin/:id',auth.auth,productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id',[auth.auth,path],productoController.actualizar_producto_admin);
api.delete('/eliminar_producto_admin/:id',auth.auth,productoController.eliminar_producto_admin);

//inventario
api.get('/listar_inventario_producto_admin/:id',auth.auth,productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id',auth.auth,productoController.eliminar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin',auth.auth,productoController.registro_inventario_producto_admin);


module.exports = api;