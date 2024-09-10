import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { response } from 'express';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrl: './index-contacto.component.css'
})
export class IndexContactoComponent implements OnInit {
  public mensajes: Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token: any;
  public load_btn = false;

  constructor(
    private _adminService: AdminService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response => {
        // console.log(response);
        this.mensajes = response.data;
        this.load_data = false;
      }
    );
  }

  cerrar(id:any): void {
    this.load_btn = true;
    this._adminService.cerrar_mensaje_admin(id,{data:undefined},this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se cerró correctamente el mensaje'
        });

        $('#estadoModal-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.init_Data();
        this.load_btn = false;

      },
      error=>{
        console.log(error);
      }
    );
  }

}
