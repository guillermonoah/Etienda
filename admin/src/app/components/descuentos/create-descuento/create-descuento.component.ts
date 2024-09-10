import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DescuentoService } from '../../../services/descuento.service';
import { Router } from '@angular/router';

declare var jQuery:any;
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-create-descuento',
  templateUrl: './create-descuento.component.html',
  styleUrl: './create-descuento.component.css'
})
export class CreateDescuentoComponent {
  public descuento : any = {};
  public file:any=undefined;
  public imgSelect:any| ArrayBuffer = 'assets/img/01.jpg';
  public token: any;
  public load_btn = false;

  constructor(
    
    private _adminService:AdminService,
    private _descuentoService:DescuentoService,
    private _router:Router
  ){
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
        message: 'Debe subir un banner para registrar'
    });
     }else{
        if (this.descuento.descuento >=1 && this.descuento.descuento <=100) {
          this.load_btn = true;

          this._descuentoService.registro_descuento_admin(this.descuento,this.file,this.token).subscribe(
            response=>{
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                class: 'text-SUCCESS',
                position: 'topRight',
                message: 'Se registro correctamente el nuevo descuento'
              });

              this.load_btn = false;
              this._router.navigate(['/panel/descuentos']);
            },
            error=>{
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
      
      $('#input-banner').text('Seleccionar imagen');
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
