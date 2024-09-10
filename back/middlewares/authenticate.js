'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'diegoararca';
// var secret ='codificarTienda';

exports.auth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message:'NoHeadersError'});
    }
        
    var token = req.headers.authorization.replace(/['"]+/g,'');
    var segment = token.split('.');
    
    if(segment.length != 3){
        return res.status(403).send({message:'InvalidToken'});
    }else{
        try {
            var payload = jwt.decode(token,secret);

            if(payload.exp <= moment().unix()){
                return res.status(403).send({message:'Token Expirado'});
            }

        } catch (error) {
            return res.status(403).send({message:'InvalidToken'});            
        }
    }
    req.user = payload;
    next();
}