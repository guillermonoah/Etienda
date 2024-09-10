import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../../services/global';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-detalles-ventas',
  templateUrl: './detalles-ventas.component.html',
  styleUrl: './detalles-ventas.component.css'
})
export class DetallesVentasComponent {
  public id:any;
  public url:any;
  public token:any;
  public orden:any ={};
  public detalles:Array<any> =[];
  public load_data:boolean = true;

  public totalStar: number = 5;
  public review:any ={};


  constructor(
    private _adminService: AdminService,
    private _route: ActivatedRoute
  ){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.init_data();
      }
    );
  }


  init_data(){
    this._adminService.obtener_detalles_ordenes_cliente(this.id, this.token).subscribe(
      response => {
        if (response.data != undefined) {
          this.orden = response.data;

          this.detalles = response.detalles;
          this.load_data= false;
        } else {
          this.orden = undefined;
        }
        console.log(this.orden);
        console.log(this.detalles);
      }
    );
  }
}
