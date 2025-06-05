import Rol from "./enums/Rol";

export default class Usuario {
    id?: number;
    email: string = "";
    firebaseUid: string = "";
    rol: Rol = Rol.CLIENTE;
    providerId: string = "";
    DNI: string = "";
    eliminado: boolean = false;
}
