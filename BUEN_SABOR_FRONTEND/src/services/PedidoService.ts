import Pedido from "../models/Pedido";

const API_URL = "http://localhost:8080/api/pedidos";

class PedidoService {
    async getAll(): Promise<Pedido[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async create(pedido: Pedido): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/verificar-y-procesar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });
        console.log("Status:", res.status);
        console.log("OK:", res.ok);
        if (!res.ok) {
            console.error("Error HTTP:", res.status);
            return false;
        }

        const resultado = await res.json(); // Debería ser true o false
        console.log("OK:", resultado);
        if(resultado){
            alert("Pedido guardado exitosamente");
        }else{
            alert("No se pudo procesar el pedido. Verifique el stock disponible.");
        }
        return resultado;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}
}

export default new PedidoService();