import Articulo from "./Articulo";

export default class HistoricoPrecioVenta {
    id?: number = 0;
    precio: number = 0;
    fecha: Date = new Date();
    articulo?: Articulo;
    eliminado?: boolean;
}