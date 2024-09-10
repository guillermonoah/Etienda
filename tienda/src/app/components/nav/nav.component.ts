import { Component,OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { response } from 'express';
import { io } from "socket.io-client";
import { GuestService } from '../../services/guest.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  public token:any;
  public id:any;
  // public user : any = undefined;
  public user_lc : any = undefined;
  public config_global: any ={};
  public op_cart = false;
  public carrito_Arr: Array<any> = [];
  public url:any;
  public subtotal:any = 0;
  public socket = io('http://localhost:4201');
  public descuento_activo:any  = undefined;

  constructor(
    private _clienteService:ClienteService,
    private _router:Router,
    private _guestService:GuestService
  ){
    if (typeof window !== 'undefined'){
      this.token = localStorage.getItem('token');
      this.id = localStorage.getItem('_id'); 
    }
    this.url= GLOBAL.url;

    this._clienteService.obtener_config_publico().subscribe(
      response=>{
        this.config_global = response.data;
      }
    )

    // console.log(this.user_lc);

    if (this.token) {
      this._clienteService.obtener_cliente_guest( this.id,this.token).subscribe(
        response=>{
          this.user_lc= response.data;
          localStorage.setItem('user_data',JSON.stringify(this.user_lc));
          if(localStorage.getItem('user_data')){
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

            this.obtener_carrito();
          }else{
            this.user_lc = undefined;
          }
        },error=>{
          this.user_lc= undefined;
        }
      );
    }

  }

  ngOnInit(): void {
    
    this.socket.on('new-carrito',(data:any) =>{
      // console.log(data);
      this.obtener_carrito();
    });

    this.socket.on('new-carrito-add',(data:any) =>{
      console.log(data);
      this.obtener_carrito();
    });

    this._guestService.obtener_descuento_activo().subscribe(
      response => {
        if (response.data) {
          this.descuento_activo = response.data[0];
        } else {
          this.descuento_activo = undefined;
        }
      }
    );
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_Arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart(){
    if (!this.op_cart) {
      this.op_cart = true;
      $('#cart').addClass('show');
    }else{
      $('#cart').removeClass('show');

    }
  }

  calcular_carrito(){
    this.subtotal =0;
    if (this.descuento_activo == undefined) {
      this.carrito_Arr.forEach(element => {
        this.subtotal = this.subtotal + parseInt(element.producto.precio);
      })
    } else {
      this.carrito_Arr.forEach(element => {
        let new_precio =Math.round( parseInt(element.producto.precio) -(parseInt(element.producto.precio)*this.descuento_activo.descuento)/100);
        this.subtotal = this.subtotal + new_precio;
      })
    }
  }

  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino el producto correctamente t'
        });

        this.socket.emit('delete-carrito',{data:response.data});
        console.log(response);
      }
    );
  }

}
