import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-index-ordenes',
  templateUrl: './index-ordenes.component.html',
  styleUrl: './index-ordenes.component.css'
})
export class IndexOrdenesComponent implements OnInit {

  public url:any;
  public token:any;
  public ordenes:Array<any> =[];
  public load_data:boolean = true;
  public page = 1;
  public pageSize = 15;

  constructor(
    private _clienteService: ClienteService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
      this.init_data();
  }

  init_data(){
    this._clienteService.obtener_ordenes_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        console.log(response);
        this.ordenes = response.data;
        this.load_data = false;
      }
    );
  }



}
