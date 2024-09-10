import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { response } from 'express';
import { GLOBAL } from '../../../services/global';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrl: './galeria-producto.component.css'
})
export class GaleriaProductoComponent implements OnInit {
  public producto: any ={};
  public id: any;
  public token: any;
 
  public file:any=undefined;
  public load_btn: boolean = false;
  public load_btn_eliminar: boolean = false;
  public url: any;
 
  constructor(  
   private _route: ActivatedRoute,
   private _productoService: ProductoService
  ){  
   this._route.params.subscribe(
     params=>{
 
       this.token = localStorage.getItem('token');
       this.url= GLOBAL.url;
       this.id =params['id'];
 
       this.init_data();
     }
   );
  }

  init_data(){
     
    this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
      response=>{
        if(response.data == undefined){
          this.producto = undefined;
        }else{
          this.producto = response.data;
       
        }
        console.log(this.producto);
      },
      error=>{

      }
    )
  }

  ngOnInit(): void {
    
  }
  
  fileChangeEvent(event:any):void{
    var file;
    if (event.target.files && event.target.files[0]){
      file = <any>event.target.files[0];
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'No hay una imagen de envio'
      });
    }

    if (file.size <= 4000000) {
      //as
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {
     
        this.file = file;

      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen'
        });
        $('#input-img').val('');
        this.file = undefined;
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'La imagen No puede superar los 4MB'
       });

       $('#input-img').val('');
       this.file = undefined;
    }

    console.log(this.file);
  }
 
  subir_imagen(){
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        _id: uuidv4()
      }
      console.log(data);
      this._productoService.agregar_imagen_galeria_admin(this.id,data,this.token).subscribe(
        response=>{              
          this.init_data();
          $('#input-img').val('');      
        }
      );

    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe selecionar una imagen para subir'
     });
    }
  }
 
  eliminar(id:any){
    this.load_btn_eliminar =true;
    this._productoService.eliminar_imagen_galeria_admin(this.id,{_id:id},this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino correctamente la imagen'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        
        this.load_btn_eliminar =false;
        this.init_data();
      },
      error=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Ocurrio un error en el servidor'
        });
        console.log('error');
        this.load_btn_eliminar =false;
      }
    );
  }
 
 }