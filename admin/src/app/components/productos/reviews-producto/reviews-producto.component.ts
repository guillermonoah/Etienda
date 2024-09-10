import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrl: './reviews-producto.component.css'
})
export class ReviewsProductoComponent implements OnInit {

  public id:any ;
  public token:any ;
  public _idUser:any ;
  public producto: any ={};
  public reviews: Array<any> =[];
  public url: any;
  public load_btn = false;
  public page = 1;
  public pageSize = 15;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
    ){
      this.url = GLOBAL.url;
      this.token = localStorage.getItem('token');
      this._idUser = localStorage.getItem('_id');
      console.log(this._idUser);
    }

    ngOnInit(): void {
      this._route.params.subscribe(
        params=>{
          this.id =params['id'];

          this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
            response=>{
              if(response.data == undefined){
                this.producto = undefined;
              }else{
                this.producto = response.data;

                this._productoService.obtener_reviews_producto_publico(this.producto._id).subscribe(
                  response=>{
                    this.reviews = response.data;
                  }
                );
              }
            },
            error=>{

            }
          )
        }
      );
    }
}
