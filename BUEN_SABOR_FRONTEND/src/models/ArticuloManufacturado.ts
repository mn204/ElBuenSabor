import Articulo from "./Articulo";
import DetalleArticuloManufacturado from "./DetalleArticuloManufacturado";
import type HistoricoPrecioCompra from "./HistoricoPrecioCompra";
import type HistoricoPrecioVenta from "./HistoricoPrecioVenta";
import ImagenArticulo from "./ImagenArticulo";

export default class ArticuloManufacturado extends Articulo {
    descripcion: string = "";
    tiempoEstimadoMinutos: number = 0;
    preparacion: string = "";
    detalles: DetalleArticuloManufacturado[] = [];
    imagenesArticuloManufacturado: ImagenArticulo[] = [];
    historicosPrecioVenta: HistoricoPrecioVenta[] = [];
    historicosPrecioCompra: HistoricoPrecioCompra[] = [];
}