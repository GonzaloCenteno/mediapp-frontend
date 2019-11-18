import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  mensajeValidacion = new Subject<Object[]>();
  mensajeError = new Subject<Object[]>();

  constructor() { }
}
