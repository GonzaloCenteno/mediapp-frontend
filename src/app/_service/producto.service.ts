import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Producto } from '../_model/producto';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  productoCambio = new Subject<Producto[]>();
  mensajeCambio = new Subject<Object>();

  url: string = `${environment.HOST}/productos`;

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Producto[]>(this.url);
  }

  listarProductos(page: number, size: number, sort: string, order: number){
    return this.http.get<any>(`${this.url}/pageable/?page=${page}&size=${size}&sort=${sort}&order=${order}`);
  }

  listarPorId(idProducto: number){
    return this.http.get<Producto>(`${this.url}/${idProducto}`);
  }

  guardarDatos(producto: Producto){
    return this.http.post(this.url, producto);
  }

  modificarDatos(producto: Producto){
    return this.http.put(this.url, producto);
  }

  eliminarDatos(idProducto: number){
    return this.http.delete(`${this.url}/${idProducto}`);
  }

}
