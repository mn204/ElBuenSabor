import  Sucursal from "../models/Sucursal.ts";

const API_BASE = "http://localhost:8080/api/sucursal";

export const obtenerSucursales = async (): Promise<Sucursal[]> => {
    const res = await fetch(`${API_BASE}`);
    return await res.json();
};