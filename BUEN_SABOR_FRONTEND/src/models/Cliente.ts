import ImagenCliente from "./ImagenCliente";
import UsuarioCliente from "./UsuarioCliente";
import Domicilio from "./Domicilio";
import Pedido from "./Pedido";

export default class Cliente {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    dni: number = 0;
    fechaNacimiento: Date = new Date();
    imagenCliente?: ImagenCliente;
    usuarioCliente?: UsuarioCliente;
    domicilios: Domicilio[] = [];
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}