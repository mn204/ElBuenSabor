import ImagenArticulo from "./ImagenArticulo";
import UnidadMedida from "./UnidadMedida";
import Categoria from "./Categoria";

export default abstract class Articulo {
    id?: number = 0;
    denominacion: string = "";
    precioVenta: number = 0;
    imagenes: ImagenArticulo[] = [];
    unidadMedida?: UnidadMedida;
    categoria?: Categoria;
    eliminado?: boolean;
}