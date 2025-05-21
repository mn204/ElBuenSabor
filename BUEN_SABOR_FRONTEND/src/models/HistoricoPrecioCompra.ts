import Articulo from "./Articulo";

export default class HistoricoPrecioCompra{
    id: number = 0;
    precioVenta: number = 0;
    fecha: Date = new Date();
    articulo: Articulo = new Articulo();
}