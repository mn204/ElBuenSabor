export default class Promocion {
    id?: number = 0;
    nombre: string = "";
    descripcion: string = "";
    fechaDesde: Date = new Date();
    fechaHasta: Date = new Date();
    descuento: number = 0;
    activa: boolean = false;
    eliminado?: boolean;
}