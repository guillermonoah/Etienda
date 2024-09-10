import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { v4 as uuidv4 } from 'uuid';
import { response } from 'express';
import { GLOBAL } from '../../services/global';

declare var jQuery:any;
declare var $:any;
declare var iziToast:any;


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit{
  public token:any;
  public config:any ={};
  public url:any;
  public titulo_cat:any ='';
  public icono_cat:any ='';
  public file:any =undefined;
  public imgSelect: any | ArrayBuffer = '';

  constructor
  (
    private _adminService: AdminService
  )
  {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_admin(this.token).subscribe(
      reponse=>{
        this.config = reponse.data;
        this.imgSelect = this.url+'obtener_logo/'+this.config.logo;
        // console.log(this.config);
      },
      error=>{
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    
  }

  agregar_cat(){
    if(this.titulo_cat && this.icono_cat){
      console.log(uuidv4());

      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4()
      });

      this.titulo_cat = '';
      this.icono_cat = '';

    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un titulo e icono para la categoria'
      });
    }
  }

  actualizar(confForm:any){
    if(confForm.valid){
      let data = {
        titulo: confForm.value.titulo,
        serie: confForm.value.serie,
        correlativo: confForm.value.correlativo,
        categorias: this.config.categorias,
        logo: this.file
      }

      console.log(data);

      this._adminService.actualizar_config_admin("662286d17cd4489f221372be",data,this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            class: 'text-SUCCESS',
            position: 'topRight',
            message: 'Se actualizó correctamente la configuración'
          });
        }
      );

    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Complete correctamente el formulario'
      });
    }
  }

  fileChangeEvent(event:any):void{
    var file;
    if(event.target.files && event.target.files[0]){
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
       
        $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
        $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
       
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

  ngDoCheck(): void {
    
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">");
  }

  eliminar_categoria(idx:any){
    this.config.categorias.splice(idx,1);
  }

}