import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PersonaService } from 'src/app/_service/persona.service';
import { ProductoService } from 'src/app/_service/producto.service';
import { FiltroPersonasDTO } from 'src/app/_dto/filtroPersonasDTO';
import { VentasService } from 'src/app/_service/ventas.service';
import * as moment from 'moment';
import { Producto } from 'src/app/_model/producto';
import { DetalleVenta } from 'src/app/_model/detalleVenta';
import { Venta } from 'src/app/_model/venta';
import { Persona } from 'src/app/_model/persona';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  providers: [MessageService]
})
export class VentaComponent implements OnInit {

  ventasForm: FormGroup;

  ctrlpersona: FormControl = new FormControl();
  personas: any[] = [];
  productos: any[] = [];

  ctrlproducto: FormControl = new FormControl();

  producto: Producto;
  persona: Persona;
  cantidad: number;
  importe: number;

  detalleVenta: DetalleVenta[] = [];

  constructor(private personaService: PersonaService,
    private productoService: ProductoService,
    private ventaService: VentasService,
    private messageService: MessageService) { }

  ngOnInit() {

    this.ventasForm = new FormGroup({
      'id': new FormControl(0),
      'persona': this.ctrlpersona,
      'importe': new FormControl(),
      'producto': this.ctrlproducto,
      'cantidad': new FormControl(),
    });

    this.listarPersonas();
    this.listarProductos();

    console.log(moment().format('YYYY-MM-DDTHH:mm:ss'));

    this.ventaService.mensajeCambio.subscribe((data: any) => {
      this.messageService.add(
        {
          severity: data.tipo,
          life: 1700,
          summary: data.titulo,
          detail: data.mensaje
        }
      );
    });

  }

  listarPersonas() {
    this.personaService.listar().subscribe((data: any) => {
      data.forEach((el: any) => {
        this.personas.push({ label: `${el.nombres} ${el.apellidos}`, value: el.idPersona });
      });
    });
  }

  listarProductos() {
    this.productoService.listar().subscribe((data: any) => {
      data.forEach(el => {
        this.productos.push({ label: `${el.nombre} - ${el.marca}`, value: el.idProducto });
      });
    });
  }

  agregarDetalle() {
    let dataMensaje = { tipo:"error", titulo:"SISTEMA", mensaje:"Falta agregar Cantidad y/o Producto" };

    if (this.cantidad != null && this.ventasForm.value['producto'] != null) {
      let producto = new Producto();
      producto.idProducto = this.ventasForm.value['producto'];

      let det = new DetalleVenta();
      det.cantidad = this.cantidad;
      det.producto = producto;
      this.detalleVenta.push(det);
      console.log(det);
      this.cantidad = null;
      this.producto = null;
    } else {
      this.ventaService.mensajeCambio.next(dataMensaje);
    }
  }

  removerDetalle(index: number) {
    this.detalleVenta.splice(index, 1);
  }

  guardarDatos() {
    if(this.ventasForm.value['persona'] == null){
      let dataMensaje = { tipo:"info", titulo:"SISTEMA", mensaje:"DEBES ELEGIR UNA PERSONA" };
      this.ventaService.mensajeCambio.next(dataMensaje);
      return false;
    }

    if(this.detalleVenta.length == 0){
      let dataMensaje = { tipo:"info", titulo:"SISTEMA", mensaje:"DETALLE NO PUEDE ESTAR VACIO" };
      this.ventaService.mensajeCambio.next(dataMensaje);
      return false;
    }

    let dataMensaje = { tipo:"success", titulo:"SE REGISTRO", mensaje:"Se Guardo con Exito" };

    let persona = new Persona();
    persona.idPersona = this.ventasForm.value['persona'];

    let venta = new Venta();
    venta.persona = persona;
    venta.fecha = moment().format('YYYY-MM-DDTHH:mm:ss');
    venta.importe = this.ventasForm.value['importe'];
    venta.detalleventa = this.detalleVenta;

    this.ventaService.guardarDatos(venta).subscribe(() => {
      this.ventaService.mensajeCambio.next(dataMensaje);
      setTimeout(() => {
        this.limpiarControles();
      }, 1300);
    });
  }

  limpiarControles() {
    this.cantidad = null;
    this.producto = null;
    this.persona = null;
    this.importe = null;
    this.detalleVenta = [];
  }

}
