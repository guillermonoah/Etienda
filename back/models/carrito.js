'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    producto: {type: Schema.ObjectId, ref:'producto', required: true},
    cliente: {type: Schema.ObjectId, ref:'cliente', required: true},
    cantidad: {type: Number, required: true},
    variedad: {type: String, required: true},
    createdAt:{type:Date, default: Date.now, require:true}
});

module.exports = mongoose.model('carrito', CarritoSchema);
