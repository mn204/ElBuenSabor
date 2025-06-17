import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardArticulo from "./CardArticulo"; // Ajusta la ruta según tu estructura
import CategoriaService from "../../services/CategoriaService"; // Ajusta la ruta según tu estructura
import ArticuloService from "../../services/ArticuloService"; // Ajusta la ruta según tu estructura
import Categoria from "../../models/Categoria";
import Articulo from "../../models/Articulo"; // Asume que tienes este modelo

const BusquedaCategoria: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoriaYArticulos = async () => {
            if (!id) {
                setError("ID de categoría no válido");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Buscar la categoría por ID
                const categoriaEncontrada = await CategoriaService.getById(parseInt(id));
                if (!categoriaEncontrada) {
                    setError("Categoría no encontrada");
                    setLoading(false);
                    return;
                }

                setCategoria(categoriaEncontrada);

                // Buscar artículos de esa categoría
                const articulosEncontrados = await ArticuloService.buscarPorIdCategoria(categoriaEncontrada);
                setArticulos(articulosEncontrados);
                console.log(articulosEncontrados)

            } catch (err) {
                console.error("Error al cargar categoría y artículos:", err);
                setError("Error al cargar la información. Por favor, intenta de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoriaYArticulos();
    }, [id]);

    const handleVolverAtras = () => {
        navigate(-1); // Volver a la página anterior
    };

    if (loading) {
        return (
            <div className="busqueda-categoria">
                <div className="busqueda-categoria__loading">
                    <div className="spinner"></div>
                    <p>Cargando categoría y productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="busqueda-categoria">
                <div className="busqueda-categoria__error">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={handleVolverAtras}
                        className="btn btn-secondary"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }
    const handleBackClick = () => {
        navigate(-1);
    };
    return (
        <div className="busqueda-categoria m-5">
            {/* Header con información de la categoría */}
            <div className="busqueda-categoria__header">
                <button
                    onClick={handleBackClick}
                    className="promocion-detalle__back-button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                    Volver
                </button>

                <div className="busqueda-categoria__info">
                    <h1 className="busqueda-categoria__title">
                        {categoria?.denominacion}
                    </h1>

                    {categoria?.categoriaPadre && (
                        <p className="busqueda-categoria__parent">
                            Subcategoría de: <span>{categoria.categoriaPadre.denominacion}</span>
                        </p>
                    )}

                    <p className="busqueda-categoria__count">
                        {articulos.length} {articulos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                </div>
            </div>

            {/* Lista de artículos */}
            <div className="busqueda-categoria__content">
                {articulos.length > 0 ? (
                    <div className="busqueda-categoria__grid d-flex gap-5">
                        {articulos.map((articulo) => (
                            <CardArticulo
                                key={articulo.id}
                                articulo={articulo}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="busqueda-categoria__empty">
                        <div className="busqueda-categoria__empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8" />
                                <path d="21 21l-4.35-4.35" />
                            </svg>
                        </div>
                        <h3>No hay productos en esta categoría</h3>
                        <p>Actualmente no hay productos disponibles en "{categoria?.denominacion}"</p>
                        <button
                            onClick={handleVolverAtras}
                            className="btn btn-primary"
                        >
                            Explorar otras categorías
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusquedaCategoria;