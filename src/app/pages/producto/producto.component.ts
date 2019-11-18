import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/_service/producto.service';
import { Producto } from 'src/app/_model/producto';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ProductoComponent implements OnInit {

  productoForm: FormGroup;
  formulario: boolean = false;
  columnas: any[];
  productos: Producto[];
  productoSeleccionado: Producto;
  totalData: number;
  first: number = 1;
  rows: number = 10;
  sort: string = "idProducto";
  order: number = 1;
  cargador: boolean;

  constructor(private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {

    this.productoService.productoCambio.subscribe((data: any) => {
      this.productos = data.content;
    });

    this.productoService.mensajeCambio.subscribe((data: any) => {
      this.messageService.add(
        {
          severity: data.tipo,
          life: 1700,
          summary: data.titulo,
          detail: data.mensaje
        }
      );
    });

    this.productoForm = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'marca': new FormControl('')
    });

    this.productoService.listarProductos(0, 10, this.sort, this.order).subscribe(data => {
      this.productos = data.content;
      this.totalData = data.totalElements;
    });

    this.columnas = [
      { field: 'idProducto', header: 'ID PRODUCTO' },
      { field: 'nombre', header: 'NOMBRE PRODUCTO' },
      { field: 'marca', header: 'MARCA PRODUCTO' }
    ];

    this.cargador = true;
  }

  CargaPeresoza(event: LazyLoadEvent) {
    this.cargador = true;
    this.sort = event.sortField == null ? "idProducto" : event.sortField;
    this.order = event.sortOrder;
    let index = (event.first / event.rows);
    this.productoService.listarProductos(index, event.rows, this.sort, this.order).subscribe(data => {
      this.productos = data.content;
      this.totalData = data.totalElements;
      this.cargador = false;
      this.first = event.first;
      this.rows = event.rows;
    });
  }

  abrirFormulario() {
    this.formulario = true;
    this.productoForm = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(),
      'marca': new FormControl()
    });
  }

  operar() {
    let producto = new Producto();
    producto.idProducto = this.productoForm.value['id'];
    producto.nombre = this.productoForm.value['nombre'];
    producto.marca = this.productoForm.value['marca'];

    if (this.productoForm.value['id'] != 0) {
      let dataMensaje = { tipo: "info", titulo: "SE MODIFICO", mensaje: "Se Modifico con Exito" };
      this.productoService.modificarDatos(producto).pipe(switchMap(() => {
        return this.productoService.listarProductos(this.first / this.rows, this.rows, this.sort, this.order);
      })).subscribe(data => {
        this.productoService.productoCambio.next(data);
        this.productoService.mensajeCambio.next(dataMensaje);
        this.formulario = false;
      });
    }
    else {
      let dataMensaje = { tipo: "success", titulo: "SE REGISTRO", mensaje: "Se Guardo con Exito" };
      this.productoService.guardarDatos(producto).pipe(switchMap(() => {
        return this.productoService.listarProductos(this.first / this.rows, this.rows, this.sort, this.order);
      })).subscribe(data => {
        this.productoService.productoCambio.next(data);
        this.productoService.mensajeCambio.next(dataMensaje);
        this.formulario = false;
      });
    }
  }

  editarFormulario(producto: any) {
    this.productoService.listarPorId(producto.idProducto).subscribe(data => {
      this.productoForm = new FormGroup({
        'id': new FormControl(data.idProducto),
        'nombre': new FormControl(data.nombre),
        'marca': new FormControl(data.marca)
      });
      this.formulario = true;
    });
  }

  eliminarFormulario(producto: Producto) {
    let dataMensaje1 = { tipo: "error", titulo: "SE ELIMINO", mensaje: "Se Elimino con Exito" };
    let dataMensaje2 = { tipo: "info", titulo: "NO SE ELIMINO", mensaje: "Se cancelo la eliminacion" };

    this.confirmationService.confirm({
      message: `¿ESTAS SEGURO DE QUERER ELIMINAR ESTE REGISTRO? : ${producto.nombre}`,
      header: 'MENSAJE DE CONFIRMACION',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.productoService.eliminarDatos(producto.idProducto).pipe(switchMap(() => {
          return this.productoService.listarProductos(this.first / this.rows, this.rows, this.sort, this.order);
        })).subscribe(data => {
          this.productoService.productoCambio.next(data);
          this.productoService.mensajeCambio.next(dataMensaje1);
        });
      },
      reject: () => {
        this.productoService.mensajeCambio.next(dataMensaje2);
      }
    });
    
  }

}
