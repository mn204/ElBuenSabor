import  Empleado  from "../models/Empleado";

const API_URL = "http://localhost:8080/api/empleado";


export const registrarEmpleado = async (empleado: Empleado): Promise<Response> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado)
    });

    return response;
};

export const obtenerEmpleadoPorUsuarioId = async (usuarioId: number) => {
    const response = await fetch(`${API_URL}/usuario/${usuarioId}`);
    if (!response.ok) {
        throw new Error('Empleado no encontrado');
    }
    return response.json();
};

// Obtener empleado por ID
export const obtenerEmpleadoPorId = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Empleado no encontrado');
    }
    return response.json();
};
