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
            if (resultado) {
                alert("Pedido guardado exitosamente");
            } else {
                alert("No se pudo procesar el pedido. Verifique el stock disponible.");
            }
            return resultado;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    }
    async getPedidoPorId(idPedido: number) : Promise<Pedido> {
        try {
            const res = await fetch(`${API_URL}/${idPedido}`);
            if (!res.ok) throw new Error("Error al obtener pedido");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
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

    async getPedidosFiltrados(
        idSucursal: number | null, // <-- Cambié a opcional
        filtros: {
            estado?: string;
            clienteNombre?: string;
            idPedido?: number;
            idEmpleado?: number; // <-- Agregué idEmpleado
            fechaDesde?: string; // Formato ISO, ej: '2025-06-13T00:00:00'
            fechaHasta?: string;
        },
        page: number = 0,
        size: number = 10
    ): Promise<{ content: Pedido[]; totalPages: number }> {
        const params = new URLSearchParams();

        // Solo agregar idSucursal si no es null
        if (idSucursal !== null) {
            params.append("idSucursal", idSucursal.toString());
        }

        if (filtros.estado) params.append("estado", filtros.estado);
        if (filtros.clienteNombre) params.append("clienteNombre", filtros.clienteNombre);
        if (filtros.idPedido !== undefined) params.append("idPedido", filtros.idPedido.toString());
        if (filtros.idEmpleado !== undefined) params.append("idEmpleado", filtros.idEmpleado.toString()); // <-- Nueva línea
        if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
        if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);

        params.append("page", page.toString());
        params.append("size", size.toString());

        const response = await fetch(`${API_URL}/filtrados?${params.toString()}`);
        if (!response.ok) {
            throw new Error("Error al obtener pedidos filtrados");
        }

        return await response.json();
    }

    async cambiarEstadoPedido(pedido: Pedido): Promise<void> {
        const response = await fetch(`${API_URL}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pedido),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Error al cambiar el estado del pedido: " + errorText);
        }
    }

    async exportarPedidos(pedidosSeleccionados: Pedido[]): Promise<Blob> {
        const response = await fetch(`${API_URL}/excel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pedidosSeleccionados),
        });

        if (!response.ok) {
            throw new Error("Error al exportar pedidos");
        }

        const blob = await response.blob();
        return blob;
    }
}

export default new PedidoService();