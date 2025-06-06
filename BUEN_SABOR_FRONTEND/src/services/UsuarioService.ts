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
// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Error al obtener usuarios');
    }
    return response.json();
};

export const actualizarDatosUsuario = async (id: number, datosActualizados: Usuario): Promise<Usuario | null> => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!response.ok) {
            console.error("Error al actualizar el usuario:", response.statusText);
            return null;
        }

        const usuarioActualizado: Usuario = await response.json();
        return usuarioActualizado;
    } catch (error) {
        console.error("Error en la solicitud PUT:", error);
        return null;
    }
};
