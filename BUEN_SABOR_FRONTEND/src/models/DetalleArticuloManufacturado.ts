import ArticuloInsumo from "./ArticuloInsumo";
import ArticuloManufacturado from "./ArticuloManufacturado";

export default class DetalleArticuloManufacturado {
    id?: number;
    cantidad: number = 0;
    articuloInsumo?: ArticuloInsumo;
    articuloManufacturado?: ArticuloManufacturado; // <-- Agregado para reflejar el backend
    eliminado!: boolean;
}