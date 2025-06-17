import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardArticulo from "./CardArticulo";
import Articulo from "../../models/Articulo";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";

function Busqueda() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resultados, setResultados] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    setError(null);

    const fetchAllData = async () => {
      try {
        let allResults: Articulo[] = [];

        // 1. Buscar productos manufacturados por denominación
        try {
          const productosData = await ArticuloManufacturadoService.buscarPorDenominacion(query);
          
          // Si solo hay un resultado, navegar directamente
          if (productosData.length === 1) {
            navigate(`/articulo/${productosData[0].id}`);
            return;
          }
          
          allResults = [...productosData];
        } catch (error) {
          console.error('Error al buscar productos manufacturados:', error);
        }

        // 2. Obtener todos los artículos con stock > 0
        try {
          const articulosResponse = await fetch(
            `http://localhost:8080/api/articulo/stock/0`
          );
          if (articulosResponse.ok) {
            const articulosData = await articulosResponse.json();
            allResults = [...allResults, ...articulosData];
          }
        } catch (error) {
          console.error('Error al buscar artículos:', error);
        }

        console.log("Todos los resultados:", allResults);
        setResultados(allResults);
        setLoading(false);

      } catch (error) {
        console.error('Error general:', error);
        setError('Error al cargar los resultados');
        setLoading(false);
      }
    };

    fetchAllData();
  }, [query, navigate]);

  console.log("Resultados en el render:", resultados);

  return (
    <div className="resultados-busqueda">
      {loading && <p>Cargando resultados...</p>}
      {error && <p>Error: {error}</p>}
      {query && !loading && !error && resultados.length === 0 && (
        <p>No se encontraron artículos.</p>
      )}
      {resultados.length > 1 && (
        <>
          <h2>Resultados para "{query}"</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {resultados.map((articulo) => (
              <CardArticulo key={articulo.id} articulo={articulo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Busqueda;