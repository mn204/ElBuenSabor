import { useEffect, useState } from "react";
import ArticuloInsumo from "../../models/ArticuloInsumo";
import UnidadMedida from "../../models/UnidadMedida";
import Categoria from "../../models/Categoria";
import articuloInsumoService from "../../services/ArticuloInsumoService";
import unidadMedidaService from "../../services/UnidadMedidaService";
import categoriaService from "../../services/CategoriaService";
import { Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ImagenArticulo from "../../models/ImagenArticulo";
import { subirACloudinary } from "../../funciones/funciones";

function FormInsumos() {
    const [denominacion, setDenominacion] = useState("");
    const [precioVenta, setPrecioVenta] = useState<number>(0);
    const [unidad, setUnidad] = useState<string>("");
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [categoria, setCategoria] = useState<string>("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [eliminado, setEliminado] = useState(false);
    const [elaborar, setElaborar] = useState(false);
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [imagenesExistentes, setImagenesExistentes] = useState<ImagenArticulo[]>([]);
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get("id");

    const eliminarImagenNueva = (idx: number) => {
        setImagenes(prev => prev.filter((_, i) => i !== idx));
    };

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
                setElaborar(!!insumo.esParaElaborar);
                // Cargar imágenes existentes si las hay
                if (insumo.imagenes && insumo.imagenes.length > 0) {
                    setImagenesExistentes(insumo.imagenes);
                }
            });
        }
    }, [idFromUrl]);

    const Guardar = async () => {
        const insumo = new ArticuloInsumo();
        insumo.id = idFromUrl ? Number(idFromUrl) : undefined;
        insumo.denominacion = denominacion;
        insumo.precioVenta = precioVenta;
        insumo.eliminado = eliminado;
        
        const nuevasImagenes = await Promise.all(
            imagenes.map(async (file) => {
                const url = await subirACloudinary(file);
                const imagen = new ImagenArticulo();
                imagen.denominacion = url; // Usamos URL en lugar de base64
                imagen.eliminado = false;
                return imagen;
            })
        );
        
        const imagenesNoEliminadas = imagenesExistentes.filter(img => !img.eliminado);

        insumo.imagenes = [
            ...imagenesNoEliminadas,
            ...nuevasImagenes,
        ];
        insumo.esParaElaborar = elaborar;
        insumo.unidadMedida = unidad ? unidadesMedida.find(um => um.id === Number(unidad))! : new UnidadMedida();
        insumo.categoria = categoria ? categorias.find(cat => cat.id === Number(categoria))! : new Categoria();
        
        try {
            console.log("articulo: ", insumo)
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

    const eliminarImagenExistente = (idx: number) => {
        setImagenesExistentes(prev =>
            prev.map((img, i) => (i === idx ? { ...img, eliminado: true } : img))
        );
    };

    const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const nuevosArchivos = Array.from(e.target.files as FileList);

            // Filtra para evitar duplicados por nombre y tamaño
            const archivosFiltrados = nuevosArchivos.filter(nuevo =>
                !imagenes.some(img => img.name === nuevo.name && img.size === nuevo.size)
            );

            if (archivosFiltrados.length < nuevosArchivos.length) {
                alert("Algunas imágenes ya fueron seleccionadas y no se agregarán de nuevo.");
            }

            setImagenes(prev => [...prev, ...archivosFiltrados]);
        }
    };

    return (
        <>
            <h2 className="mt-5">{idFromUrl ? "Actualizar" : "Crear"} Insumo</h2>
            <form className="formContainer container d-flex flex-column gap-3 text-start" style={{maxWidth: 500}} onSubmit={e => e.preventDefault()}>
                <div>
                    <label>Denominación:</label>
                    <input className="form-control" value={denominacion} onChange={e => setDenominacion(e.target.value)} />
                </div>
                <div>
                    <label>Precio Venta:</label>
                    <input className="form-control" type="number" value={precioVenta} onChange={e => setPrecioVenta(Number(e.target.value))} />
                </div>
                <div>
                    <label>Unidad de Medida:</label>
                    <select className="form-control" value={unidad} onChange={e => setUnidad(e.target.value)}>
                        <option value="">Seleccione una opción</option>
                        {unidadesMedida.map(um => (
                            <option key={um.id} value={um.id}>{um.denominacion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Categoría:</label>
                    <select className="form-control" value={categoria} onChange={e => setCategoria(e.target.value)}>
                        <option value="">Seleccione una opción</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
                        ))}
                    </select>
                </div>
                
                {/* Imágenes */}
                <div className="d-flex flex-column">
                    <label>Imágenes:</label>
                    {/* Imágenes existentes */}
                    {imagenesExistentes.length > 0 && (
                        <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
                            {imagenesExistentes.map((img, idx) =>
                                !img.eliminado && (
                                    <div key={img.id || idx} style={{ position: "relative", display: "inline-block" }}>
                                        <img
                                            src={img.denominacion}
                                            alt={`img-existente-${idx}`}
                                            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => eliminarImagenExistente(idx)}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                cursor: "pointer",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                    {/* Imágenes nuevas */}
                    <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
                        {imagenes.map((img, idx) => (
                            <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`preview-${idx}`}
                                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => eliminarImagenNueva(idx)}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 20,
                                        height: 20,
                                        cursor: "pointer",
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImagenesChange}
                        className="form-control mt-2"
                    />
                </div>

                <div>
                    <label>Estado:</label>
                    <select
                        className="form-control"
                        value={eliminado ? "eliminado" : "activo"}
                        onChange={e => setEliminado(e.target.value === "eliminado")}
                    >
                        <option value="activo">Activo</option>
                        <option value="eliminado">Eliminado</option>
                    </select>
                </div>
                
                <div>
                    <label>Es para Elaborar:</label>
                    <select
                        className="form-control"
                        value={elaborar ? "si" : "no"}
                        onChange={e => setElaborar(e.target.value === "si")}
                    >
                        <option value="si">Sí</option>
                        <option value="no">No</option>
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