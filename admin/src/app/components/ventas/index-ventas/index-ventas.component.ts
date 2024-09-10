import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrl: './index-ventas.component.css'
})
export class IndexVentasComponent implements OnInit {
  public token:any;
  public desde:any;
  public hasta:any;
  public ventas:Array<any>=[];
  public page = 1;
  public pageSize = 10;

  constructor(
    private _adminService: AdminService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
      this._adminService.obtener_ventas_admin(this.desde,this.hasta,this.token).subscribe(
        response =>{
          this.ventas = response.data;
        }
      );
  }

  filtrar(){
    this._adminService.obtener_ventas_admin(this.desde,this.hasta,this.token).subscribe(
      response =>{
        this.ventas = response.data;
      }
    );
  }

}
