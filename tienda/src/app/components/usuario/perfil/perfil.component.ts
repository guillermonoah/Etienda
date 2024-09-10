import { Component ,OnInit} from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { response } from 'express';
import { log } from 'node:console';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{
  public cliente : any ={};
  public id : any ;
  public token : any ;

  constructor(
    private _clienteService:ClienteService
  ){
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if (this.id) {
      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
          this.cliente = response.data;
        },
        error=>{
          console.log(error)

        }
      );
    }
  }

  ngOnInit(): void {
    
  }

  actualizar(actualizarForm:any){
    this.cliente.password = $('#password').val();
    if (actualizarForm.valid) {
      this._clienteService.actualizar_perfil_cliente_guest(this.id,this.cliente,this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            class: 'text-SUCCESS',
            position: 'topRight',
            message: 'Se actualizó su perfil correctamente'
          });
        }
      );
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
}
