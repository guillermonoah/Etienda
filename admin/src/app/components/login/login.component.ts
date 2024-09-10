import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { error } from 'console';
import { response } from 'express';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

declare var jQuery:any;
declare var $:any;
declare var iziToast:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  public user : any = {};
  public usuario : any = {};
  public token : any = '';

  constructor(
    private _adminService:AdminService,
    private _router:Router,
  ){
    // $('body').attr('style','background:#000!important');

    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    // console.log(this.token);
    if(this.token){
      this._router.navigate(['/']);
    }else{
      //Mantener en el componente
    }
  }

  login(loginForm:any){
    if(loginForm.valid){
      // console.log(this.user);

      let data = {
        email:this.user.email,
        password: this.user.password
      }

      this._adminService.login_admin(data)
      .pipe(
        tap(response => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });
          } else {
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            //aqui abajo vamos a guardar la clave primaria de este usuario
            localStorage.setItem('_id', response.data._id);
            //reedireccion
            this._router.navigate(['/']);
          }
          // console.log(response);
        }),
        catchError((error: any) => {
          console.log(error);
          return of(null);
        })
      )
      .subscribe();    

    }
  }

 
}
