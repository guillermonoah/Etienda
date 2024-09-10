import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DescuentoService } from '../../../services/descuento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from '../../../services/global';

declare var jQuery:any;
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-edit-descuento',
  templateUrl: './edit-descuento.component.html',
  styleUrl: './edit-descuento.component.css'
})
export class EditDescuentoComponent implements OnInit {
  public descuento : any = {};
  public file:any=undefined;
  public imgSelect:any| ArrayBuffer = 'assets/img/01.jpg';
  public token: any;
  public load_btn = false;
  public id:any;
  public url;

  constructor(
    
    private _adminService:AdminService,
    private _descuentoService:DescuentoService,
    private _router:Router,    
    private _route: ActivatedRoute
  ){
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id =params['id'];
        console.log(this.id);
        this._descuentoService.obtener_descuento_admin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
              this.descuento = undefined;
            }else{
              this.descuento = response.data;
              this.imgSelect = this.url +'obtener_banner_descuento/'+this.descuento.banner;
            }
            console.log(response);
          },
          error=>{
            console.log(error);

          }
        )
      }
    );
  }

  actualizar(actualizarForm:any){
    if(actualizarForm.valid){
      if (this.descuento.descuento >=1 && this.descuento.descuento <=100) {
        var data: any = {};

        if (this.file != undefined){
          data.banner = this.file;
        }
  
        data.titulo = this.descuento.titulo;
        data.fecha_inicio = this.descuento.fecha_inicio;
        data.fecha_fin = this.descuento.fecha_fin;
        data.descuento = this.descuento.descuento;
  
        
        this.load_btn = true;
  
        this._descuentoService.actualizar_descuento_admin(data,this.id,this.token).subscribe(
          response=>{
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              class: 'text-SUCCESS',
              position: 'topRight',
              message: 'Se actualizó correctamente el descuento'
            });
            
            this.load_btn = false;
            this._router.navigate(['/panel/descuentos']);
          },
          error=>{
            console.log(error);
            this.load_btn = false;
          }
        );
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'El descuento debe ser de 1 a 100 %'
      });
      this.load_btn = false;
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
        console.log(this.imgSelect);
       
        reader.readAsDataURL(file);
       
        $('#input-banner').text(file.name);
        this.file = file;

      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen'
        });
        $('#input-banner').text('Seleccionar imagen');
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
       $('#input-banner').text('Seleccionar imagen');
       this.imgSelect ='assets/img/01.jpg';
       this.file = undefined;
    }

    console.log(this.file);
  }
}
