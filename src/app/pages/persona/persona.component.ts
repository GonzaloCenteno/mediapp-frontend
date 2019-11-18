import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'src/app/_service/persona.service';
import { Persona } from 'src/app/_model/persona';
import { switchMap } from 'rxjs/operators';
import { MessageService, LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  providers: [MessageService]
})
export class PersonaComponent implements OnInit {

  dialogoPersona: boolean;
  personas: Persona[];
  nuevaPersona: boolean;
  columnas: any[];
  persona: Persona;
  personaSeleccionada: Persona;
  totalData: number;
  cargador: boolean;
  first: number = 1;
  rows: number = 10;
  sort: string = "idPersona";
  order: number = 1;
  borrar:boolean;

  constructor(private personaService: PersonaService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.personaService.personaCambio.subscribe((data:any) => {
      this.personas = data.content;
      //this.totalData = this.personas.length;
    });

    this.personaService.mensajeCambio.subscribe( (data:any) => {
      this.messageService.add(
        {
          severity: data.tipo,
          life: 1700, 
          summary: data.titulo,
          detail: data.mensaje
        }
      );
    });
    
    this.personaService.listarPersonas(0, 10, this.sort, this.order).subscribe(data => {
      this.personas = data.content;
      this.totalData = data.totalElements;
    });
    
    this.columnas = [
      { field: 'idPersona', header: 'ID PERSONA' },
      { field: 'nombres', header: 'NOMBRES' },
      { field: 'apellidos', header: 'APELLIDOS' }
    ];

    this.cargador = true;
  }

  abrirNuevaPersona() {
    this.nuevaPersona = true;
    this.persona = new Persona();
    this.dialogoPersona = true;
    this.borrar = false;
  }

  save() {
    if(this.nuevaPersona){
      let dataMensaje = { tipo:"success", titulo:"SE REGISTRO", mensaje:"Se Guardo con Exito" };
      this.personaService.guardarDatos(this.persona).pipe(switchMap( () => {
        return this.personaService.listarPersonas(this.first/this.rows, this.rows, this.sort, this.order);
      })).subscribe(data => {
        this.personaService.personaCambio.next(data);
        this.personaService.mensajeCambio.next(dataMensaje);
      });
    }else{
      let dataMensaje = { tipo:"info", titulo:"SE MODIFICO", mensaje:"Se Modifico con Exito" };
      this.personaService.modificarDatos(this.persona).pipe(switchMap( () => {
        return this.personaService.listarPersonas(this.first/this.rows, this.rows, this.sort, this.order);
      })).subscribe(data => {
        this.personaService.personaCambio.next(data);
        this.personaService.mensajeCambio.next(dataMensaje);
      });
    }
    this.dialogoPersona = false;
  }

  seleccionado(){
    this.personaService.listarPorId(this.personaSeleccionada.idPersona).subscribe( data => {
      this.persona = new Persona();
      this.persona.idPersona = data.idPersona;
      this.persona.nombres = data.nombres;
      this.persona.apellidos = data.apellidos;
      this.nuevaPersona = false;
      this.dialogoPersona = true;
      this.borrar = true;
    });
  }

  delete(){
    let dataMensaje = { tipo:"error", titulo:"SE ELIMINO", mensaje:"Se Elimino con Exito" };
    this.personaService.eliminarDatos(this.personaSeleccionada.idPersona).pipe(switchMap( () => {
      return this.personaService.listarPersonas(this.first/this.rows, this.rows, this.sort, this.order);
    })).subscribe(data => {
      this.personaService.personaCambio.next(data);
      this.personaService.mensajeCambio.next(dataMensaje);
      this.dialogoPersona = false;
    });
  }

  CargaPeresoza(event: LazyLoadEvent) {
    this.cargador = true;
    this.sort = event.sortField == null ? "idPersona" : event.sortField;
    this.order = event.sortOrder;
    let index = (event.first/event.rows);
    this.personaService.listarPersonas(index,event.rows,this.sort, this.order).subscribe(data =>{
      this.personas = data.content;
      this.totalData = data.totalElements;
      this.cargador = false;
      this.first = event.first;
      this.rows = event.rows;
    });
  }
}
