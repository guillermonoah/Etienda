import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { response } from 'express';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{
  public token:any;
  public total_ganancia:any = 0;
  public total_mes:any = 0;
  public count_ventas:any = 0;
  public total_mes_anterior:any = 0;

  constructor(
    private _adminService: AdminService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
      this.init_data();

  }

  init_data(){
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response=>{
        // console.log(response);
        this.total_ganancia = response.total_ganancia;
        this.total_mes = response.total_mes;
        this.count_ventas=response.count_ventas;
        this.total_mes_anterior = response.total_mes_anterior;

        var canvas = <HTMLCanvasElement> document.getElementById('myChart');
        var ctx = canvas.getContext('2d')!;
        var myChart= new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [{
              label: 'Meses',
              data: [
                response.enero,
                response.febrero,
                response.marzo,
                response.abril,
                response.mayo,
                response.junio,
                response.julio,
                response.agosto,
                response.septiembre,
                response.octubre,
                response.noviembre,
                response.diciembre
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    );
  }
}
