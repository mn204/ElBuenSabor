import Domicilio from "./Domicilio";
import Pedido from "./Pedido";
import  Usuario from "./Usuario.ts";
import type ImagenUsuario from "./ImagenUsuario.ts";

export default class Empleado {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    fechaNacimiento: Date = new Date();
    dni: number = 0;
    usuario!: Usuario;
    imagenEmpleado?: ImagenUsuario;
    domicilio?: Domicilio;
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}