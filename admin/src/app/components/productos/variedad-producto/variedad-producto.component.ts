import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { response } from 'express';
import { GLOBAL } from '../../../services/global';

declare var iziToast:any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrl: './variedad-producto.component.css'
})
export class VariedadProductoComponent implements OnInit{
 public producto: any ={};
 public id: any;
 public token: any;

 public nueva_variedad: any ='';
 public load_btn: boolean = false;
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
  );
 }
 ngOnInit(): void {
   
 }

 agregar_variedad(){
  if (this.nueva_variedad) {
    this.producto.variedades.push({titulo:this.nueva_variedad});
    this.nueva_variedad = '';
  }else{
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      class: 'text-danger',
      position: 'topRight',
      message: 'El campo de la variedad debe ser completado'
    });
  }
 }

 eliminar_variedad(idx:any){
  this.producto.variedades.splice(idx,1);
}

  actualizar(){
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length >=1) {
        //actualizar
        this.load_btn = true;
        this._productoService.actualizar_producto_variedades_admin({
          titulo_variedad : this.producto.titulo_variedad,
          variedades : this.producto.variedades
        },this.id,this.token).subscribe(
          response=>{
            console.log(response);

            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              class: 'text-SUCCESS',
              position: 'topRight',
              message: 'Se actualizó correctamente las variedades'
            });
            this.load_btn = false;
          }
        )
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe agregar almenos una variedad'
        });
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe completar el titulo de la variedad'
      });
    }
  }
}
