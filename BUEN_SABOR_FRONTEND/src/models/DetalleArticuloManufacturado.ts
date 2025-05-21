import ArticuloInsumo from "./ArticuloInsumo";

export default class DetalleArticuloManufacturado {
    id?: number = 0;
    cantidad: number = 0;
    articuloInsumo?: ArticuloInsumo;
    eliminado?: boolean;
}