import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroPersonasDTO } from '../_dto/filtroPersonasDTO';
import { Venta } from '../_model/venta';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  mensajeCambio = new Subject<Object>();
  
  url: string = `${environment.HOST}/ventas`;

  constructor(private http: HttpClient) { }

  buscarPersonas(filtroPersona: FiltroPersonasDTO)
  {
    return this.http.post<Venta[]>(`${this.url}/buscar`, filtroPersona)
  }

  guardarDatos(venta: Venta)
  {
    return this.http.post(this.url, venta);
  }

}
