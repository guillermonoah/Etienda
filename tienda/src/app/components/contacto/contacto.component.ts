import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../services/guest.service';

declare var iziToast:any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit{

  public contacto: any = {};
  public load_btn = false;

  constructor(
    private _guestService: GuestService
  ){}

  ngOnInit(): void {

  }

  registro(registroForm:any){
    if (registroForm.valid){
      this.load_btn = true;
      this._guestService.enviar_mensaje_contacto(this.contacto).subscribe(
        response => {

          console.log(response);

          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              class: 'text-SUCCESS',
              position: 'topRight',
              message: 'Se envio correctamente el mensaje'
          });

          this.contacto = {};
          this.load_btn = false;
        }
      );
    } else {
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
