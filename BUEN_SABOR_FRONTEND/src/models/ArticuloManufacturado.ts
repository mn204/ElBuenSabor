import Articulo from "./Articulo";
import DetalleArticuloManufacturado from "./DetalleArticuloManufacturado";
import type HistoricoPrecioCompra from "./HistoricoPrecioCompra";
import type HistoricoPrecioVenta from "./HistoricoPrecioVenta";
import ImagenArticuloManufacturado from "./ImagenArticuloManufacturado";

export default class ArticuloManufacturado extends Articulo {
    descripcion: string = "";
    tiempoEstimadoMinutos: number = 0;
    preparacion: string = "";
    detalles: DetalleArticuloManufacturado[] = [];
    imagenesArticuloManufacturado: ImagenArticuloManufacturado[] = [];
    historicosPrecioVenta: HistoricoPrecioVenta[] = [];
    historicosPrecioCompra: HistoricoPrecioCompra[] = [];
}