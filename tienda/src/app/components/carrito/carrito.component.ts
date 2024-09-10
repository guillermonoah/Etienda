import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { GLOBAL } from '../../services/global';
import { response } from 'express';
import { GuestService } from '../../services/guest.service';
import { io } from "socket.io-client";

declare var Cleave:any;
declare var StickySidebar:any;
declare var paypal:any;
declare var iziToast:any;

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
} 

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  
  @ViewChild('paypalButton', { static: true })
  paypalElement: ElementRef | any;

  public idcliente: any;
  public token:any;

  public carrito_Arr: Array<any> = [];
  public url:any;
  public subtotal:any = 0;
  public total_pagar:any = 0;
  
  public direccion_principal: any ={};
  public envios: Array<any> =[];
  public precio_envio = "0";
  public venta :any ={}
  public dventa: Array<any> =[];
  public socket = io('http://localhost:4201');
  public error_cupon = '';
  public descuento = 0;
  public descuento_activo:any  = undefined;

  constructor(
    private _clienteService:ClienteService,
    private _guestService:GuestService
  ){
    this.idcliente = localStorage.getItem('_id');
    this.venta.cliente = this.idcliente;
    this.token = localStorage.getItem('token');
    this.url= GLOBAL.url;


    this._guestService.get_envios().subscribe(
      response=>{
        this.envios = response; 
      }
    )
}

  ngOnInit(): void {
    this.init_data();

    this._guestService.obtener_descuento_activo().subscribe(
      response => {
        if (response.data) {
          this.descuento_activo = response.data[0];
        } else {
          this.descuento_activo = undefined;
        }
      }
    );

    this.init_data();

    setTimeout(() => {
        new Cleave('#cc-number', {
          creditCard: true,
          onCreditCardTypeChanged: function (type:any) {
              // update UI ...
          }
        });

        var cleave = new Cleave('#cc-exp-date', {
          date: true,
          datePattern: ['m', 'y']
        });

        var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});


        this.get_direccion_principal();

        paypal.Buttons({
          style: {
              layout: 'horizontal'
          },
          createOrder: (data:any,actions:any)=>{

              return actions.order.create({
                purchase_units : [{
                  description : 'Nombre del pago',
                  amount : {
                    currency_code : 'USD',
                    value: 999
                  },
                }]
              });

          },
          onApprove : async (data:any,actions:any)=>{
            const order = await actions.order.capture();
            console.log(order);

            this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
            this.venta.detalles= this.dventa;
            this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
              response=>{
                console.log(response);

              }
            );
            console.log(this.dventa);
          },
          onError : (err: any) =>{

          },
          onCancel: function (data:any, actions:any) {

          }
        }).render(this.paypalElement.nativeElement);

    });


  }

  init_data(){
    this._clienteService.obtener_carrito_cliente(this.idcliente, this.token).subscribe(
      response=>{
        this.carrito_Arr = response.data;

        this.carrito_Arr.forEach(element=>{
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('_id')
          });
        });

        this.calcular_carrito();
        this.calcular_total('Envio gratis');
      }
    );
  }

  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        if(response.data == undefined){
          this.direccion_principal = undefined;
          }else{
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }  
      }
    );
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
  
  calcular_total(envio_titulo:any){
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;

    console.log(this.venta);    
  }

  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino el producto correctamente'
        });

        this.socket.emit('delete-carrito',{data:response.data});
        console.log(response);
        this.init_data();
      }
    );
  }


  validar_cupon(){
    if (this.venta.cupon) {
      if(this.venta.cupon.toString().length <= 25){
        //valido
        this._clienteService.validar_cupon_cliente(this.venta.cupon, this.token).subscribe(
          response=>{
            if (response.data != undefined) {
              //descuento
              this.error_cupon = '';

              if (response.data.tipo == 'valor fijo') {
                this.descuento =response.data.valor;
                this.total_pagar = this.total_pagar - this.descuento;
              } else if(response.data.tipo == 'Porcentaje'){
                this.descuento = (this.total_pagar * response.data.valor)/100;
                this.total_pagar = this.total_pagar - this.descuento;
              }

            } else {
              this.error_cupon = 'El cupón no se pudo canjear';
            }
            console.log(response);
          }
        );

      }else{
        //no valido
        this.error_cupon = 'El cupón debe ser menos de 25 caracteres';
      }
    } else {
      this.error_cupon = 'El cupón no es válido';
    }

  }
}
