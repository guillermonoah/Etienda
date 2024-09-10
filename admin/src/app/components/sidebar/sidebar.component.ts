import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public nombreAdmin : any = undefined;
  public token : any;

  constructor(
    private _adminService: AdminService,
    private _router:Router,
  ){
    this.token = localStorage.getItem('token');

    this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response=>{
        this.nombreAdmin = response.data[0].cliente
      }
    );
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

}
