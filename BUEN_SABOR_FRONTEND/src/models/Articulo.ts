import type HistoricoPrecioCompra from "./HistoricoPrecioCompra";
import HistoricoPrecioVenta from "./HistoricoPrecioVenta";
import Imagen from "./ImagenArticulo";

export default class Articulo {
    id: number = 0;
    descripcion: string = "";
    precioVenta: HistoricoPrecioVenta[] = [];
    precioCompra: HistoricoPrecioCompra[] = [];
    imagenes: Imagen[] = [];
    unidadMedida: string = "";
}