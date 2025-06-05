import  Empleado  from "../models/Empleado";

export const registrarEmpleado = async (empleado: Empleado): Promise<Response> => {
    const response = await fetch("http://localhost:8080/api/empleado", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado)
    });

    return response;
};