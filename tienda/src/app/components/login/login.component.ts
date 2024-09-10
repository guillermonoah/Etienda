import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { response } from 'express';
import { error } from 'console';

declare var iziToast:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public user : any = {};
  public usuario : any= {};
  public token : any;

  constructor(
    private _clienteServie:ClienteService,
    private _router: Router
  ){
    this.token = localStorage.getItem('token');
    if (this.token) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {

  }

  login(loginForm:any){
   if (loginForm.valid) {
        let data ={
          email:this.user.email,
          password:this.user.password,
        }

        this._clienteServie.login_cliente(data).subscribe(
          response=>{
            if (response.data == undefined) {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                class: 'text-danger',
                position: 'topRight',
                message:response.message
              });
            }else{
              this.usuario = response.data;
              localStorage.setItem('token',response.token);
              localStorage.setItem('_id',response.data._id);

              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                class: 'text-SUCCESS',
                position: 'topRight',
                message: 'Se logeo correctamente'
              });
              this._router.navigate(['/cuenta/perfil']);
            }
          },
          error=>{
            console.log(error);
          }
        );
   }else{
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
