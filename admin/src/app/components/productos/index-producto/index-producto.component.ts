import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { response } from 'express';
import { error } from 'console';
import { GLOBAL } from '../../../services/global';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrl: './index-producto.component.css'
})
export class IndexProductoComponent implements OnInit {
  public load_data = true;
  public filtro = '';
  public token;
  public producto :Array<any> =[];
  public url = GLOBAL.url;
  public page = 1;
  public pageSize = 10;
  public load_btn = false;

  constructor(
    private _productoService : ProductoService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {

    this.init_data();
    
  }

  init_data(){
    this._productoService.listar_producto_admin(this.filtro,this.token).subscribe(
      response=>{
        console.log(response);
        this.producto = response.data;
        this.load_data = false;

      },
      error=>{
        console.log(error);
      }
    )
  }

  filtrar(){
    if (this.filtro){
      this._productoService.listar_producto_admin(this.filtro,this.token).subscribe(
        response=>{
          console.log(response);
          this.producto = response.data;
          this.load_data = false;
  
        },
        error=>{
          console.log(error);
        }
      )
    }else{
      iziToast.show({
        title: 'Error',
        titleColor: '#FF0000',
        class: 'text-SUCCESS',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar'
      });
    }
  }
  
  limpiar(){
    this.filtro='';
    this.init_data();
  }
  eliminar(id:any){
    this.load_btn =true;
    this._productoService.eliminar_producto_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino correctamente el producto'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        
        this.load_btn =false;
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
        this.load_btn =false;
      }
    );
  }

}
