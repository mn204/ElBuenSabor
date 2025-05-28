import ArticuloInsumo from "../models/ArticuloInsumo";

const API_URL = "http://localhost:8080/api/articulo";

class ArticuloInsumoService {
    async getAll(): Promise<ArticuloInsumo[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener insumos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getById(id: number): Promise<ArticuloInsumo> {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Error al obtener insumo");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new ArticuloInsumoService();