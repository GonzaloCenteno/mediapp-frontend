import { Persona } from './persona';
import { DetalleVenta } from './detalleVenta';

export class Venta {
    idVenta: number;
    persona: Persona;
    fecha: string;
    importe: number;
    detalleventa: DetalleVenta[];
}