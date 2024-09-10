import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../../services/guest.service';
import { response } from 'express';
import { elementAt } from 'rxjs';
import { ClienteService } from '../../../services/cliente.service';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.css'
})
export class DireccionesComponent implements OnInit{

  public token: any;
  public direccion : any = {
    pais:'',
    region:'',
    provincia:'',
    distrito:'',
    principal:false
  };
  public direcciones:Array<any>=[];

  public regiones:Array<any>=[];
  public provincias:Array<any>=[];
  public distritos:Array<any>=[];
  public regiones_arr:Array<any>=[];
  public provincias_arr:Array<any>=[];
  public distritos_arr:Array<any>=[];
  public load_data= true;

  constructor(
    private _guestService:GuestService,
    private _clienteService:ClienteService

  ){
    this.token = localStorage.getItem('token');

    this._guestService.get_regiones().subscribe(
      response=>{
        this.regiones_arr = response;
      }
    );

    this._guestService.get_provincias().subscribe(
      response=>{
        this.provincias_arr = response;
      }
    );

    this._guestService.get_distritos().subscribe(
      response=>{
        this.distritos_arr = response;
      }
    );


  }

  ngOnInit(): void {
    this.obtener_direccion();
  }

  obtener_direccion(){
    this._clienteService.obtener_direccion_todos_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        this.direcciones = response.data;
        this.load_data = false;
      }
    );
  }

  select_pais(){
    if (this.direccion.pais == 'Perú') {
      $('#region').prop('disabled',false);

      this._guestService.get_regiones().subscribe(
        response=>{
          console.log(response);
          response.forEach((element: { id: any, name: any; }) => {
            this.regiones.push({
              id: element.id,
              name: element.name
            });
          });
          console.log(this.regiones);

        }
      );

    }else{
      $('#region').prop('disabled',true);
      $('#provincia').prop('disabled',true);
      this.regiones =[];
      this.provincias =[];

      this.direccion.region = ''
      this.direccion.provincia = ''
    }
  }

  select_region(){
    this.provincias =[];
    $('#provincia').prop('disabled',false);
    $('#distrito').prop('disabled',true);
    this.direccion.provincia = ''
    this.direccion.distrito = ''

    this._guestService.get_provincias().subscribe(
      response=>{
        response.forEach((element: { department_id: any; } ) => {
          if (element.department_id == this.direccion.region) {
            this.provincias.push(
              element
            );
          // } else {
           console.log(this.provincias);

          }
        });
    }
    );
  }

  select_provincia(){
    this.distritos =[];
    $('#distrito').prop('disabled',false);
    this.direccion.distrito = ''

    this._guestService.get_distritos().subscribe(
      response=>{
        response.forEach((element: { province_id: any; } ) => {
          if (element.province_id == this.direccion.provincia) {
            this.distritos.push(
              element
            );
          // } else {
           console.log(this.distritos);

          }
        });

      }
    )
  }

  registrar(registroForm:any){
    if (registroForm.valid) {
      this.regiones_arr.forEach(element =>{
        if (parseInt(element.id) == parseInt(this.direccion.region)) {
          this.direccion.region = element.name;
        }
      })
      this.provincias_arr.forEach(element =>{
        if (parseInt(element.id) == parseInt(this.direccion.provincia)) {
          this.direccion.provincia = element.name;
        }
      })
      this.distritos_arr.forEach(element =>{
        if (parseInt(element.id) == parseInt(this.direccion.distrito)) {
          this.direccion.distrito = element.name;
        }
      })

      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        region: this.direccion.region,
        provincia: this.direccion.provincia,
        distrito: this.direccion.distrito,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id')
      }

      this._clienteService.registro_direccion_cliente(data,this.token).subscribe(
        response=>
          {
            this.direccion = {
              pais:'',
              region:'',
              provincia:'',
              distrito:'',
              principal:false
            };

            $('#region').prop('disabled',true);
            $('#provincia').prop('disabled',true);
            $('#distrito').prop('disabled',true);

            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              class: 'text-SUCCESS',
              position: 'topRight',
              message: 'Se agrego la nueva dirección correctamente'
            });
          }
      )
      console.log(data);

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message:'Los datos del formulario no son validos'
      });
    }
  }

  establecer_principal(id:any){
    this._clienteService.cambiar_direccion_principal_cliente(id,localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se actualizó la dirección correctamente'
        });
        console.log(response);

          this.obtener_direccion();
      }
    );
  }


}
