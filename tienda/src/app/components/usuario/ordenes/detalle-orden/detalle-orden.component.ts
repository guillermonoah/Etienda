import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../../../services/global';
import { NgxStarsComponent } from 'ngx-stars';
import { response } from 'express';


declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrl: './detalle-orden.component.css'
})
export class DetalleOrdenComponent implements OnInit {

  public id:any;
  public url:any;
  public token:any;
  public orden:any ={};
  public detalles:Array<any> =[];
  public load_data:boolean = true;

  public totalStar: number = 5;
  public review:any ={};


  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.init_data();
      }
    );
  }

  ngOnInit(): void {
  }

  init_data(){
    this._clienteService.obtener_detalles_ordenes_cliente(this.id, this.token).subscribe(
      response => {
        if (response.data != undefined) {
          this.orden = response.data;
          response.detalles.forEach((element: any) => {
            this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
              response => {

                let emitido = false;
                response.data.forEach((element_2:any) => {
                  if (element_2.cliente == localStorage.getItem('_id')) {
                    emitido = true;
                  }
                });
                element.estado = emitido;
              }
            );
          });

          this.detalles = response.detalles;
          this.load_data= false;
        } else {
          this.orden = undefined;
        }
        console.log(response);
        
      }
    );
  }

  openModal(item:any){
    this.review = {};
    this.review.producto = item.producto._id;
    this.review.cliente = item.cliente;
    this.review.venta = this.id;
    console.log(this.review);
  }

  onRatingSet(event:any):void{
    this.totalStar = event;
    // console.log(this.totalStar);
  }

  emitir(id:any){
      if (this.review.review) {
        if (this.totalStar && this.totalStar >= 0) {
          this.review.estrellas = this.totalStar;

          this._clienteService.emitir_review_producto_cliente(this.review, this.token).subscribe(
            response=>{
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                class: 'text-SUCCESS',
                position: 'topRight',
                message: 'Se correctamente la reseña'
              });
              $('#review-'+id).modal('hide');
              $('.modal-backdrop').removeClass('show');
              this.init_data();
            }
          );

        } else {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message:'Seleccione el numero de estrellas'
          });
        }
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message:'Ingrese un mensaje de la reseña'
        });
      }
    }
}
