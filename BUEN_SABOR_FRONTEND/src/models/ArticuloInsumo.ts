import Articulo from "./Articulo";
import Categoria from "./Categoria";
import SucursalInsumo from "./SucursalInsumo";
import UnidadMedida from "./UnidadMedida";

export default class ArticuloInsumo extends Articulo {
    precioCompra: number = 0;
    esParaElaborar!: boolean;
    sucursalInsumo!: SucursalInsumo;
    historicosPrecioCompra: ArticuloInsumo | undefined;
    unidadMedida: UnidadMedida = new UnidadMedida();
    categoria: Categoria = new Categoria();
}