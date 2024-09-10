import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../services/global';
import { ProductoService } from '../../../services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var iziToast:any;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrl: './index-producto.component.css'
})
export class IndexProductoComponent implements OnInit {
  public load_data = true;
  public filtro = '';
  public token;
  public producto :Array<any> =[];
  public arr_producto :Array<any> =[];
  public url = GLOBAL.url;
  public page = 1;
  public pageSize = 10;
  public load_btn = false;

  constructor(
    private _productoService : ProductoService
  ){
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {

    this.init_data();
    
  }

  init_data(){
    this._productoService.listar_producto_admin(this.filtro,this.token).subscribe(
      response=>{
        // console.log(response);
        this.producto = response.data;
        this.producto.forEach(
          element => {
            this.arr_producto.push({
              titulo: element.titulo,
              stock: element.stock,
              precio: element.precio,
              categoria: element.categoria,
              nventas: element.nventas
            });
          });

        // console.log(this.arr_producto);
        this.load_data = false;

      },
      error=>{
        console.log(error);
      }
    )
  }

  filtrar(){
    if (this.filtro){
      this._productoService.listar_producto_admin(this.filtro,this.token).subscribe(
        response=>{
          console.log(response);
          this.producto = response.data;
          this.load_data = false;
  
        },
        error=>{
          console.log(error);
        }
      )
    }else{
      iziToast.show({
        title: 'Error',
        titleColor: '#FF0000',
        class: 'text-SUCCESS',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar'
      });
    }
  }
  
  limpiar(){
    this.filtro='';
    this.init_data();
  }
  eliminar(id:any){
    this.load_btn =true;
    this._productoService.eliminar_producto_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Se elimino correctamente el producto'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        
        this.load_btn =false;
        this.init_data();
      },
      error=>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-SUCCESS',
          position: 'topRight',
          message: 'Ocurrio un error en el servidor'
        });
        console.log('error');
        this.load_btn =false;
      }
    );
  }

  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for(let x1 of this.arr_producto){
      let x2= Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push	(x1[y])
      }
      worksheet.addRow(temp)
    }
    
    let fname='REP01';

    worksheet.columns = [
      {header: 'Producto', key: 'col1', width:30},
      {header: 'Stock', key: 'col2', width:15},
      {header: 'Precio', key: 'col3', width:15},
      {header: 'Categoria', key: 'col4', width:25},
      {header: 'N° ventas', key: 'col5', width:15},
    ] as any;

    workbook.xlsx.writeBuffer().then((data)=>{
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });
  }
}
