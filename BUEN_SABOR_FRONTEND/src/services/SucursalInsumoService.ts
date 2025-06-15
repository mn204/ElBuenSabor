import SucursalInsumo from "../models/SucursalInsumo";

const API_URL = "http://localhost:8080/api/sucursal-insumo";

class SucursalInsumoService{
    async create(sucursalInsumo: SucursalInsumo): Promise<any> {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sucursalInsumo)
            });
            if (!res.ok) throw new Error("Error al crear la categoria");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new SucursalInsumoService();