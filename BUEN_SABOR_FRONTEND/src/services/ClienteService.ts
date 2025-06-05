// src/service/clienteService.ts

import  Cliente  from "../models/Cliente";

export const registrarCliente = async (cliente: Cliente): Promise<Response> => {
    const response = await fetch("http://localhost:8080/api/cliente", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente)
    });

    return response;
};
