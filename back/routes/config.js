'use strict'

var express = require('express');
var configController = require('../controllers/configController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/configuraciones'});

api.put('/actualizar_config_admin/:id',[auth.auth,path],configController.actualizar_config_admin);
api.get('/obtener_config_admin',auth.auth,configController.obtener_config_admin);
api.get('/obtener_logo/:img',configController.obtener_logo);

module.exports = api;