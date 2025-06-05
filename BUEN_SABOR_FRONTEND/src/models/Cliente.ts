import ImagenUsuario from "./ImagenUsuario.ts";
import Usuario from "./Usuario";
import Domicilio from "./Domicilio";
import Pedido from "./Pedido";

export default class Cliente {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    fechaNacimiento: Date = new Date();
    imagenUsuario?: ImagenUsuario;
    usuario!: Usuario;
    domicilios: Domicilio[] = [];
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}