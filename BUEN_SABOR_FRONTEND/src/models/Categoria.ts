export default class Categoria {
    id?: number = 0;
    denominacion: string = "";
    categoriaPadre?: Categoria;
    subcategorias: Categoria[] = [];
    eliminado?: boolean;
}