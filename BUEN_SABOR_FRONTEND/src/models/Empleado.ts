import ImagenEmpleado from "./ImagenEmpleado";
import UsuarioEmpleado from "./UsuarioEmpleado";
import Domicilio from "./Domicilio";
import Pedido from "./Pedido";

export default class Empleado {
    id?: number = 0;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    fechaNacimiento: Date = new Date();
    dni: number = 0;
    rolEmpleado: string = "";
    imagenEmpleado?: ImagenEmpleado;
    usuarioEmpleado?: UsuarioEmpleado;
    domicilio?: Domicilio;
    pedidos: Pedido[] = [];
    eliminado?: boolean;
}