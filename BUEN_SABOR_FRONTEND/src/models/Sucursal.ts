import Empresa from "./Empresa";
import Domicilio from "./Domicilio";
import Categoria from "./Categoria";
import Promocion from "./Promocion";
import SucursalInsumo from "./SucursalInsumo";

export default class Sucursal {
    id?: number = 0;
    nombre: string = "";
    horarioApertura?: string;
    horarioCierre?: string;
    casaMatriz?: boolean;
    empresa?: Empresa;
    domicilio?: Domicilio;
    categorias: Categoria[] = [];
    promociones: Promocion[] = [];
    insumos: SucursalInsumo[] = [];
    eliminado?: boolean;
}