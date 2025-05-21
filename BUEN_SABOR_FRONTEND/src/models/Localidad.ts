import Provincia from "./Provincia";

export default class Localidad {
    id?: number = 0;
    nombre: string = "";
    provincia?: Provincia;
    eliminado?: boolean;
}