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

    async getPedidosCliente(clienteId: number, filtros: any, page: number, size: number): Promise<{ content: Pedido[]; totalPages: number }> {
        const params = new URLSearchParams();

        if (filtros.sucursal) params.append("sucursal", filtros.sucursal);
        if (filtros.estado) params.append("estado", filtros.estado);
        if (filtros.desde) params.append("desde", filtros.desde);
        if (filtros.hasta) params.append("hasta", filtros.hasta);
        if (filtros.articulo) params.append("articulo", filtros.articulo);

        params.append("page", page.toString());
        params.append("size", size.toString());

        // FIX: Usar la misma base URL que los otros métodos
        const response = await fetch(`${API_URL}/cliente/${clienteId}?${params.toString()}`);
        if (!response.ok) {
            throw new Error("Error al obtener pedidos del cliente");
        }

        return await response.json();
    }

    async getDetallePedido(clienteId: number, pedidoId: number): Promise<Pedido> {
        const res = await fetch(`${API_URL}/cliente/${clienteId}/pedido/${pedidoId}`);
        if (!res.ok) throw new Error("Error al obtener detalle del pedido");
        return await res.json();
    }

    async descargarFactura(clienteId: number, pedidoId: number): Promise<Blob> {
        const res = await fetch(`${API_URL}/cliente/${clienteId}/pedido/${pedidoId}/factura`);
        if (!res.ok) throw new Error("Error al descargar la factura");
        return await res.blob();
    }
}

export default new PedidoService();