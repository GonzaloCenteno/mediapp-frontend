import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../_model/persona';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personaCambio = new Subject<Persona[]>();
  mensajeCambio = new Subject<Object>();
  
  url: string = `${environment.HOST}/personas`;

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Persona[]>(this.url);
  }

  listarPersonas(page: number, size: number, sort: string, order: number){
    return this.http.get<any>(`${this.url}/pageable/?page=${page}&size=${size}&sort=${sort}&order=${order}`);
  }

  listarPorId(idPersona: number){
    return this.http.get<Persona>(`${this.url}/${idPersona}`);
  }

  guardarDatos(persona: Persona){
    return this.http.post(this.url, persona);
  }

  modificarDatos(persona: Persona){
    return this.http.put(this.url, persona);
  }

  eliminarDatos(idPersona: number){
    return this.http.delete(`${this.url}/${idPersona}`);
  }

}
