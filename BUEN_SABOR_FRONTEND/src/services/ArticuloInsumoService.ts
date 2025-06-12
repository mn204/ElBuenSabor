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

    async delete(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Error al eliminar artículo insumo");
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

    //Busqueda de Stock bajo
    async obtenerArticulosConStockBajo(idSucursal: number): Promise<ArticuloInsumo[]> {
        try {
            const response = await fetch(`${API_URL}/stock-bajo/${idSucursal}`);
            if (!response.ok) {
                throw new Error("Error al obtener artículos con stock bajo");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    async changeEliminado(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/darAlta/${id}`, {
                method: "PUT"
            });
            if (!res.ok) throw new Error("Error al dar de alta insumo");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async create(articulo: any): Promise<any> {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articulo)
            });
            console.log(JSON.stringify(articulo));
            if (!res.ok) throw new Error("Error al crear artículo manufacturado");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async update(id: number, articulo: ArticuloInsumo): Promise<ArticuloInsumo> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articulo)
            });
            console.log(JSON.stringify(articulo))
            if (!res.ok) throw new Error("Error al actualizar artículo manufacturado");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new ArticuloInsumoService();