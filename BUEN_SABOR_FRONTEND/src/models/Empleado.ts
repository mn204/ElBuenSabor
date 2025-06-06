import Domicilio from "./Domicilio";
import Pedido from "./Pedido";
import  Usuario from "./Usuario.ts";

export default class Empleado {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    fechaNacimiento: Date = new Date();
    usuario!: Usuario;
    domicilio?: Domicilio;
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}