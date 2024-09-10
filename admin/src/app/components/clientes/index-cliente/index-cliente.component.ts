import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { response } from 'express';
import { error } from 'console';
import { AdminService } from '../../../services/admin.service';
declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrl: './index-cliente.component.css'
})
export class IndexClienteComponent implements OnInit {

  public clientes: Array<any>=[];
  public filtro_apellidos = '';
  public filtro_correo = '';
  public page = 1;
  public pageSize = 10;
  public token;
  public load_data = true;

  constructor (
    private _clienteService: ClienteService,
    private _adminService: AdminService
  ){
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this.load_data = false;
    this._clienteService.listar_clientes_filtro_admin(null,null,this.token).subscribe(
      response=>{
        this.clientes = response.data;
        // setTimeout(() => {
          
        // }, 3000);
      },
      error=>{
        console.log(error);
      }
    );
  }

  filtro(tipo: any){
    if(tipo == 'apellidos'){
      this.load_data = true;
      if(this.filtro_apellidos){
        this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_apellidos,this.token).subscribe(
          response=>{
            this.clientes = response.data;
            this.load_data = false;
            console.log(this.clientes);
          },
          error=>{
            console.log(error);    
          }
        );
      }else{        
        this.init_data();
      }
 
    }else if (tipo == 'correo'){
      
      if(this.filtro_correo){
        this.load_data = true;
        this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_correo,this.token).subscribe(
          response=>{
            this.clientes = response.data;
            this.load_data = false;
            console.log(this.clientes);
          },
          error=>{
            console.log(error);    
          }
        );
      }else{        
        this.init_data();
      }
    }
  }

  eliminar(id: any){
    this._clienteService.eliminar_cliente_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino correctamente el nuevo cliente'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.init_data();
      },
      error=>{
        console.log('error');
      }
    );
  }
}
