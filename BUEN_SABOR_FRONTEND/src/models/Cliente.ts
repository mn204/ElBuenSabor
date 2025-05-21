import ImagenCliente from "./ImagenCliente";
import UsuarioCliente from "./UsuarioCliente";
import Domicilio from "./Domicilio";
import Pedido from "./Pedido";

export default class Cliente {
    id?: number = 0;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    dni: number = 0;
    fechaNacimiento: Date = new Date();
    rolCliente: string = "";
    imagenCliente?: ImagenCliente;
    usuarioCliente?: UsuarioCliente;
    domicilios: Domicilio[] = [];
    pedidos: Pedido[] = [];
    eliminado?: boolean;
}