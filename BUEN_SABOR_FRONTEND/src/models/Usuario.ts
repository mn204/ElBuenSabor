import Rol from "./enums/Rol";

export default class Usuario {
    id?: number;
    email: string = "";
    firebaseUid: string = "";
    rol: Rol = Rol.CLIENTE;
    eliminado: boolean = false;
}
