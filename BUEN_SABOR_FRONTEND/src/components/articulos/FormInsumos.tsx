import { useEffect, useState } from "react";
import ArticuloInsumo from "../../models/ArticuloInsumo";
import UnidadMedida from "../../models/UnidadMedida";
import Categoria from "../../models/Categoria";
import articuloInsumoService from "../../services/ArticuloInsumoService";
import unidadMedidaService from "../../services/UnidadMedidaService";
import categoriaService from "../../services/CategoriaService";
import { Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

function FormInsumos() {
    const [denominacion, setDenominacion] = useState("");
    const [precioVenta, setPrecioVenta] = useState<number>(0);
    const [unidad, setUnidad] = useState<string>("");
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [categoria, setCategoria] = useState<string>("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [eliminado, setEliminado] = useState(false);

    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get("id");

    useEffect(() => {
        unidadMedidaService.getAll().then(setUnidadesMedida);
        categoriaService.getAll().then(setCategorias);
        if (idFromUrl) {
            articuloInsumoService.getById(Number(idFromUrl)).then(insumo => {
                setDenominacion(insumo.denominacion);
                setPrecioVenta(insumo.precioVenta || 0);
                setUnidad(insumo.unidadMedida?.id?.toString() || "");
                setCategoria(insumo.categoria?.id?.toString() || "");
                setEliminado(!!insumo.eliminado);
            });
        }
    }, [idFromUrl]);

    const Guardar = async () => {
        const insumo = new ArticuloInsumo();
        insumo.id = idFromUrl ? Number(idFromUrl) : undefined;
        insumo.denominacion = denominacion;
        insumo.precioVenta = precioVenta;
        insumo.eliminado = eliminado;
        insumo.unidadMedida = unidad ? unidadesMedida.find(um => um.id === Number(unidad))! : new UnidadMedida();
        insumo.categoria = categoria ? categorias.find(cat => cat.id === Number(categoria))! : new Categoria();
        try {
            if (idFromUrl) {
                await articuloInsumoService.update(Number(idFromUrl), insumo);
            } else {
                await articuloInsumoService.create(insumo);
            }
            alert("Insumo guardado exitosamente");
            window.location.href = "/articulos"; // Redirige a la lista de insumos
        } catch (error) {
            alert("Error al guardar el insumo");
        }
    };

    return (
        <>
            <h2 className="mt-5">{idFromUrl ? "Actualizar" : "Crear"} Insumo</h2>
            <form className="formContainer container d-flex flex-column gap-3 text-start" onSubmit={e => e.preventDefault()}>
                <div>
                    <label>Denominación:</label>
                    <input value={denominacion} onChange={e => setDenominacion(e.target.value)} />
                </div>
                <div>
                    <label>Precio Venta:</label>
                    <input type="number" value={precioVenta} onChange={e => setPrecioVenta(Number(e.target.value))} />
                </div>
                <div>
                    <label>Unidad de Medida:</label>
                    <select value={unidad} onChange={e => setUnidad(e.target.value)}>
                        <option value="">Seleccione una opción</option>
                        {unidadesMedida.map(um => (
                            <option key={um.id} value={um.id}>{um.denominacion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Categoría:</label>
                    <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                        <option value="">Seleccione una opción</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Estado:</label>
                    <select
                        value={eliminado ? "eliminado" : "activo"}
                        onChange={e => setEliminado(e.target.value === "eliminado")}
                    >
                        <option value="activo">Activo</option>
                        <option value="eliminado">Eliminado</option>
                    </select>
                </div>
                <Button
                    variant="success"
                    className="mt-3"
                    onClick={Guardar}
                    disabled={!denominacion || !unidad || !categoria}
                >
                    {idFromUrl ? "Actualizar" : "Crear"}
                </Button>
            </form>
        </>
    );
}

export default FormInsumos;