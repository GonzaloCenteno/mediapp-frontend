import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { PrincipalService } from '../_service/principal.service';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(private router : Router, private principalService: PrincipalService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(environment.REINTENTOS)).
            pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                    }*/
                }
            })).pipe(catchError((err) => {
                console.log(err);
                //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                if (err.status === 404) {
                    this.principalService.mensajeValidacion.next(err.error.mensaje);
                    console.log(err.message, 'ERROR 400');
                }
                else if (err.status === 401) {
                    console.log(err.message, 'ERROR 401');
                }
                else if (err.status === 500) {
                    let errores = [{error: err.error.error, trace: err.error.trace}]
                    this.principalService.mensajeError.next(errores);
                    console.log(err.error.message, 'ERROR 500');
                }
                else if (err.status === 0) {
                    let errores = [{error: "MENSAJE SISTEMA", trace: "NO HAY CONEXION CON EL SISTEMA"}]
                    this.principalService.mensajeError.next(errores);
                    console.log(err.error.message, 'ERROR 500');
                }else {
                    console.log(err.error.message, 'ERROR');
                }
                return EMPTY;
            }));
    }
}