import ImagenUsuario from "./ImagenUsuario.ts";
import Usuario from "./Usuario";
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
    imagenCliente?: ImagenUsuario;
    usuario!: Usuario;
    domicilios: Domicilio[] = [];
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}