import { Component , OnInit} from '@angular/core';
import { CuponService } from '../../../services/cupon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';

declare var iziToast:any;

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrl: './update-cupon.component.css'
})
export class UpdateCuponComponent implements OnInit{
  public token :any;
  public cupon: any ={
    tipo: ''
  };
  public load_btn = false;
  public id:any;
  public load_data = true;

  constructor(
    private _cuponService:CuponService,
    private _router:Router,
    private _route:ActivatedRoute
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);

        this._cuponService.obtener_cupon_admin(this.id,this.token).subscribe(
          response=>{
            if (response.data==undefined) {
              this.cupon = undefined;
              this.load_data = false;
            }else{
              this.cupon= response.data;
              this.load_data = false;
            }
            console.log(this.cupon);
          }
        )
      }
    );
  }

  actualizar(registroForm:any){
    if(registroForm.valid){
      this.load_btn = true;
      this._cuponService.actualizar_cupon_admin(this.id,this.cupon,this.token).subscribe(
        response=>{
          console.log(response);
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            class: 'text-SUCCESS',
            position: 'topRight',
            message: 'Se actualizó correctamente el cupón'
          });
                 
          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
        },
        error=>{
          console.log(error);
          this.load_btn = false;
        }
        );
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Error los datos del formulario no son válidos'
      });
    }
  }
}
