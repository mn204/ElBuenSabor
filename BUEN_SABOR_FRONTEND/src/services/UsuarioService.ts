// src/service/UsuarioService.ts

import Usuario from "../models/Usuario";

const BASE_URL = "http://localhost:8080/api/usuario";

export const obtenerUsuarioPorDni = async (dni: string): Promise<Usuario | null> => {
    try {
        const response = await fetch(`${BASE_URL}/dni/${dni}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error al verificar DNI:", error);
        return null;
    }
};

export const obtenerUsuarioPorEmail = async (email: string): Promise<Usuario | null> => {
    try {
        const response = await fetch(`${BASE_URL}/email/${email}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error al verificar email:", error);
        return null;
    }
};

export const obtenerUsuarioPorFirebaseUid = async (uid: string): Promise<Usuario | null> => {
    try {
        const response = await fetch(`${BASE_URL}/firebase/${uid}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error al verificar UID:", error);
        return null;
    }
};
