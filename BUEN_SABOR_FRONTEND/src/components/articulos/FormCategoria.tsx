import { useEffect, useState } from "react";
import type Categoria from "../../models/Categoria";
import { useSearchParams } from "react-router-dom";
import categoriaService from "../../services/CategoriaService";
import { Button } from "react-bootstrap";
import "../../styles/Categoria.css";

function FormCategoria() {
    const [denominacion, setDenominacion] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get("id");
    const [categoriaPadreId, setCategoriaPadreId] = useState<string>("");
    useEffect(() => {
        categoriaService.getById(Number(idFromUrl))
            .then(categoria => {
                setDenominacion(categoria.denominacion);
                setCategoriaPadreId(categoria.categoriaPadre?.id?.toString() || "");
            });
    }, [idFromUrl]);

    useEffect(() => {
        categoriaService.getAll().then(setCategorias).catch(() => setCategorias([]));
    }, []);

    const Guardar = async () => {
        const categoria: Categoria = {
            id: idFromUrl ? Number(idFromUrl) : undefined,
            denominacion,
            categoriaPadre: categoriaPadreId
                ? categorias.find(cat => cat.id === Number(categoriaPadreId))
                : undefined
        };

        try {
            if (idFromUrl) {
                await categoriaService.update(Number(idFromUrl), categoria);
            } else {
                await categoriaService.create(categoria);
            }
            alert("Categoría guardada exitosamente");
            window.location.href = "/categorias"; // Redirige a la lista de categorías
        } catch (error) {
            console.error("Error al guardar la categoría:", error);
            alert("Error al guardar la categoría");
        }
    }

    return (
        <>
        <h2 className="mt-5">{idFromUrl ? "Actualizar" : "Crear"} Categoria</h2>
        <form className="formContainer container d-flex flex-column gap-3 text-start" onSubmit={e => e.preventDefault()}>
            <div>
                <label>Denominación:</label>
                <input value={denominacion} onChange={e => setDenominacion(e.target.value)} />
            </div>
            <div>
                <label>Categoría:</label>
                <select
                    value={categoriaPadreId}
                    onChange={e => setCategoriaPadreId(e.target.value)}
                >
                    <option value="">Seleccione una opción</option>
                    {categorias
                        .filter(cat => !idFromUrl || cat.id !== Number(idFromUrl)) // Evita seleccionarse a sí misma
                        .map((cat: Categoria) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.denominacion}
                            </option>
                        ))}
                </select>
            </div>
            <Button
            variant="success"
            className="mt-3"
            onClick={Guardar}
            disabled={
                !denominacion
            }>
                {idFromUrl ? "Actualizar" : "Crear"}
            </Button>
        </form>
        </>
    );
}


export default FormCategoria;