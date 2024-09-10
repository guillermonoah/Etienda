import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../services/global';
import { DescuentoService } from '../../../services/descuento.service';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrl: './index-descuento.component.css'
})
export class IndexDescuentoComponent implements OnInit {

  public load_data = true;
  public filtro = '';
  public token;
  public descuento :Array<any> =[];
  public url = GLOBAL.url;
  public page = 1;
  public pageSize = 10;
  public load_btn = false;

  constructor(
    private _descuentosService : DescuentoService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {

    this.init_data();
    
  }

  init_data(){
    this._descuentosService.listar_descuentos_admin(this.filtro,this.token).subscribe(
      response=>{
        // console.log(response);
        this.descuento = response.data;

        this.descuento.forEach(element =>{
          var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
          var tt_fin = Date.parse(element.fecha_fin+"T00:00:00")/1000;

          // console.log(tt_inicio);
          var today = Date.parse(new Date().toString())/1000;

          if (today>tt_inicio) {
            element.estado ='Expirado';
          }
          if (today<tt_inicio) {
            element.estado ='Proximamente';
          }
          if (today>=tt_inicio && today<=tt_fin) {
            element.estado ='En progreso';
          }


          
        });

        this.load_data = false;

      },
      error=>{
        console.log(error);
      }
    )
  }
  filtrar(){
    if (this.filtro){
      this._descuentosService.listar_descuentos_admin(this.filtro,this.token).subscribe(
        response=>{
          console.log(response);
          this.descuento = response.data;
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
    // this.init_data();
  }
  eliminar(id:any){
    this.load_btn =true;
    this._descuentosService.eliminar_descuento_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino correctamente el descuento'
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
