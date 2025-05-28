import UnidadMedida from "../models/UnidadMedida";

const API_URL = "http://localhost:8080/api/unidadmedida";

class UnidadMedidaService {
    async getAll(): Promise<UnidadMedida[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener categorías");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new UnidadMedidaService();