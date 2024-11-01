import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';
import { response } from 'express';
import { Router } from '@angular/router';

declare var jQuery:any;
declare var $:any;
declare var iziToast:any;


@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrl: './create-producto.component.css'
})
export class CreateProductoComponent implements OnInit {
  public producto : any = {
    categoria:''
  };
  public file:any=undefined;
  public imgSelect:any| ArrayBuffer = 'assets/img/01.jpg';
  public config :any = {};
  public token: any;
  public load_btn = false;

  constructor(
    private _productoService:ProductoService,
    private _adminService:AdminService,
    private _router:Router
  ){
    this.config={
      height:500
    }
    this.token = this._adminService.getToken();
  }
  ngOnInit(): void {
    
  }

  registro(registroForm:any){
    if(registroForm.valid){
     if (this.file == undefined) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe subir una portada para registrar'
    });
     }else{
      console.log(this.producto);
      console.log(this.file);
      
      this.load_btn = true;

      this._productoService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            class: 'text-SUCCESS',
            position: 'topRight',
            message: 'Se registro correctamente el nuevo producto'
          });
          
          this.load_btn = false;
          this._router.navigate(['/panel/productos']);
        },
        error=>{
          console.log(error);
          this.load_btn = false;
        }
      );
     }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son válidos'
      });
      this.load_btn = false;
      
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
    }
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
       
        const reader = new FileReader();
        reader.onload = e => this.imgSelect= reader.result;
        console.log(this.imgSelect);
       
        reader.readAsDataURL(file);
       
        $('#input-portada').text(file.name);
        this.file = file;

      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect ='assets/img/01.jpg';
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
       $('#input-portada').text('Seleccionar imagen');
       this.imgSelect ='assets/img/01.jpg';
       this.file = undefined;
    }

    console.log(this.file);
  }


}
