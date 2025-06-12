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

// Obtener todos los empleados
export const obtenerTodosLosEmpleados = async (): Promise<Empleado[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Error al obtener los empleados");
    }
    return await response.json();
};

// Obtener solo empleados que no están eliminados
export const obtenerEmpleadosNoEliminados = async (): Promise<Empleado[]> => {
    const response = await fetch(`${API_URL}/noEliminado`);
    if (!response.ok) {
        throw new Error("Error al obtener los empleados no eliminados");
    }
    return await response.json();
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

// Actualizar empleado
export const actualizarEmpleado = async (id: number, empleado: Empleado): Promise<Empleado | null> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(empleado),
        });

        if (!response.ok) {
            console.error("Error al actualizar el empleado:", response.statusText);
            return null;
        }

        const empleadoActualizado: Empleado = await response.json();
        return empleadoActualizado;
    } catch (error) {
        console.error("Error en la solicitud PUT:", error);
        return null;
    }
};

//eliminar empleado
export const eliminarEmpleado = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Error al eliminar el empleado");
    }
}

//dar de alta empleado eliminado
export const darDeAltaEmpleado = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/darAlta/${id}`, {
        method: "PUT",
    });
    if (!response.ok) {
        throw new Error("Error al dar de alta el empleado");
    }
}