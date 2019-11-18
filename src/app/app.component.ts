import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { PrincipalService } from './_service/principal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title:string = 'VENTASAPP';
  items: MenuItem[];
  display: boolean;
  mensajeValidacion: Message[] = [];
  mensajeError: Message[] = [];

  constructor(private principalService: PrincipalService) { }

  ngOnInit() {

    this.principalService.mensajeValidacion.subscribe(data =>{
      this.mensajeValidacion = [];
      this.mensajeValidacion.push({severity:'warn', summary: "MENSAJE DEL SISTEMA", detail: data.toString()});
      setTimeout(() => {
        this.mensajeValidacion = [];
      }, 4000);
    });

    this.principalService.mensajeError.subscribe(data => {
      this.mensajeError = [];
      data.forEach( (el:any) => {
        this.mensajeError.push({severity:'error', summary: el.error.toString(), detail: el.trace.toString()});
      });
      setTimeout(() => {
        this.mensajeError = [];
      }, 10000);
    });

    this.items = [
      {
        label: 'MENU PRINCIPAL',
        items: [
          {label: 'PERSONA', icon: 'pi pi-fw pi-user-edit', routerLink: ['/persona'], routerLinkActiveOptions: { exact: true }},
          {label: 'PRODUCTO', icon: 'pi pi-fw pi-sign-in', routerLink: ['/producto'], routerLinkActiveOptions: { exact: true }},
          {label: 'VENTA', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/venta'], routerLinkActiveOptions: { exact: true }}
        ]
      }
    ];

  }
  
  desactivarMenu(){
    this.display = false;
  }

}
