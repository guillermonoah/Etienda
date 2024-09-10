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
api.put('/actualizar_producto_variedades_admin/:id',auth.auth,productoController.actualizar_producto_variedades_admin);
api.put('/agregar_imagen_galeria_admin/:id',[auth.auth,path],productoController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id',auth.auth,productoController.eliminar_imagen_galeria_admin);

//inventario
api.get('/listar_inventario_producto_admin/:id',auth.auth,productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id',auth.auth,productoController.eliminar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin',auth.auth,productoController.registro_inventario_producto_admin);

//Publicos
api.get('/listar_producto_publico/:filtro?',productoController.listar_producto_publico);
api.get('/obtener_producto_slug_publico/:slug',productoController.obtener_producto_slug_publico);
api.get('/listar_producto_recomendados_publico/:categoria',productoController.listar_producto_recomendados_publico);

api.get('/listar_producto_nuevos_publico',productoController.listar_producto_nuevos_publico);
api.get('/listar_producto_masvendidos_publico',productoController.listar_producto_masvendidos_publico);
api.get('/obtener_reviews_producto_publico/:id',productoController.obtener_reviews_producto_publico);

module.exports = api;