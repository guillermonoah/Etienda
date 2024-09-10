import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  public url;

  constructor
  (
    private _http:HttpClient,
  )
  {
    this.url = GLOBAL.url;
  }

  obtener_producto_slug_publico(slug:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_producto_slug_publico/'+slug,{headers:headers});
  }

  listar_producto_recomendados_publico(categoria:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_producto_recomendados_publico/'+categoria,{headers:headers});
  }
  obtener_descuento_activo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_descuento_activo',{headers:headers});
  }

  listar_producto_nuevos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_producto_nuevos_publico',{headers:headers});
  }

    listar_producto_masvendidos_publico():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(this.url+'listar_producto_masvendidos_publico',{headers:headers});
    }

    enviar_mensaje_contacto(data:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.post(this.url+'enviar_mensaje_contacto',data,{headers:headers});
    }

  obtener_reviews_producto_publico(id:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_reviews_producto_publico/'+id,{headers:headers});
  }

  get_regiones():Observable<any>{
  return this._http.get('./assets/regiones.json');
  }

  get_distritos():Observable<any>{
  return this._http.get('./assets/distritos.json');
  }

  get_provincias():Observable<any>{
  return this._http.get('./assets/provincias.json');
  }

  get_envios():Observable<any>{
  return this._http.get('./assets/envios.json');
  }


}
