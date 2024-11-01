var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            
            let reg = await Config.findById({_id:"662286d17cd4489f221372be"});
            res.status(200).send({data:reg});  

        }else{            
            res.status(500).send({message: 'NoAccess'});  
        }
    }else{        
        res.status(500).send({message: 'NoAccess'});  
    }
}

const actualizar_config_admin = async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
        /*solo para crear el primer registro luego solo se actualiza*/            
            // await Config.create({
            //     categorias:[],
            //     titulo: 'Createx',
            //     logo: 'logo.png',
            //     serie: '0001',
            //     correlativo: '000001',
            // });
          
            let data = req.body;
            if(req.files){
                console.log("Si hay Img");
                //si hay img    
                var img_path = req.files.logo.path;
                var name = img_path.split('\\');
                var logo_name= name[2];
                //se actualiza la img
                let reg = await Config.findByIdAndUpdate({_id:"662286d17cd4489f221372be"},{
                    categorias:data.categorias,
                    titulo:data.titulo,
                    logo:logo_name,
                    serie:data.serie,
                    correlativo:data.correlativo,
                });
                //se elimina la img anterior
                fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
                    if (!err) {
                        fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                            if (err) throw err;
                        });
                    }
                })
                
                res.status(200).send({data:reg});  
            }else{
                console.log("No hay Img");
                let reg = await Config.findByIdAndUpdate({_id:"662286d17cd4489f221372be"},{
                    categorias:data.categorias,
                    titulo:data.titulo,
                    serie:data.serie,
                    correlativo:data.correlativo,
                });
                
                res.status(200).send({data:reg});  
            }
        }else{            
            res.status(500).send({message: 'NoAccess'});  
        }
    }else{        
        res.status(500).send({message: 'NoAccess'});  
    }
}


const obtener_logo = async function(req,res){
    var img =  req.params['img'];
    console.log(img);

    fs.stat('./uploads/configuraciones/'+img, function(err){
        if(!err){
            let path_img = './uploads/configuraciones/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));

        }        
    })
}

module.exports ={
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo
}