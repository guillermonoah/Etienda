import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrl: './index-review.component.css'
})
export class IndexReviewComponent implements OnInit {
  public token:any;
  public url:any;
  public reviews:Array<any> = [];
  public load_data:any = true;
  public page = 1;
  public pageSize = 15;

  constructor(
    private _clienteService:ClienteService
  ){
    this.token = localStorage.getItem('token');
  }

  // ngOnInit():void{
  //   // this._clienteService.obtener_reviews_cliente(localStorage.getItem('_id'), this.token).subscribe(
  //   //   response => {
  //   //     console.log(response);
  //   //     console.log(response.data.estrellas);

  //   //     this.reviews = response.data;
  //   //     console.log(this.reviews);
  //   //     console.log(this.reviews[1].estrellas);

  //   //     this.load_data = false;
  //   //   }
  //   // );

    
  // }
  ngOnInit(): void {
    this._clienteService.obtener_reviews_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        if (response && response.data) {
          this.reviews = [];
          response.data.forEach((review: { estrellas: number; }) => {
            // Asegúrate de que 'estrellas' siempre tenga un valor por defecto
            if (!review.estrellas) {
              review.estrellas = 0;
            }
            this.reviews.push(review);
          });
        }
        console.log(this.reviews);
        
        this.load_data = false;
      },
      error => {
        console.error('Error fetching reviews', error);
        this.load_data = false;
      }
    );
  }
  

}
