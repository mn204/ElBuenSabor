import Articulo from "./Articulo";

export default class ArticuloInsumo extends Articulo {
    stockActual: number = 0;
    stockMinimo: number = 0;
    precioCompra: number = 0;
}