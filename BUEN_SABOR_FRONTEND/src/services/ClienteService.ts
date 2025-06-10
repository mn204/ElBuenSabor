// src/service/clienteService.ts

import  Cliente  from "../models/Cliente"
const API_URL = "http://localhost:8080/api/cliente";


export const registrarCliente = async (cliente: Cliente): Promise<Response> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente)
    });

    return response;
};
export const obtenerClientePorUsuarioId = async (usuarioId: number) => {
    const response = await fetch(`${API_URL}/usuario/${usuarioId}`);
    if (!response.ok) {
        throw new Error('Cliente no encontrado');
    }
    return response.json();
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Cliente no encontrado');
    }
    return response.json();
};

export const actualizarCliente = async (id: number, cliente: Cliente): Promise<Cliente | null> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cliente),
        });

        if (!response.ok) {
            console.error("Error al actualizar el cliente:", response.statusText);
            return null;
        }

        const clienteActualizado: Cliente = await response.json();
        return clienteActualizado;
    } catch (error) {
        console.error("Error en la solicitud PUT:", error);
        return null;
    }
};