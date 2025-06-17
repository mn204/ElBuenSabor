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

    const fetchData = async () => {
          try {
            let allResults: Articulo[] = [];
    
            // 1. Buscar productos por denominación
            try {
              const productosResponse = await fetch(
                `http://localhost:8080/api/productos/buscar/denominacion?denominacion=${encodeURIComponent(query)}`
              );
              if (productosResponse.ok) {
                const productosData = await productosResponse.json();
                allResults = [...productosData];
              }
            } catch (error) {
              console.error('Error al buscar productos:', error);
            }
            try {
              const productosResponse = await fetch(
                `http://localhost:8080/api/articulo/no-para-elaborar/denominacion?denominacion=${encodeURIComponent(query)}`
              );
              if (productosResponse.ok) {
                const productosData = await productosResponse.json();
                console.log(allResults)
                allResults = [...allResults, ...productosData];
              }
            } catch (error) {
              console.error('Error al buscar productos:', error);
            }
    
            // 2. Obtener todos los artículos con stock > 0
            try {
              const articulosResponse = await fetch(
                `http://localhost:8080/api/articulo/stock/0`
              );
              if (articulosResponse.ok) {
                const articulosData = await articulosResponse.json();
                // Combinar los productos encontrados con todos los artículos
                allResults = [...allResults, ...articulosData];
              }
            } catch (error) {
              console.error('Error al buscar artículos:', error);
            }
    
            // Establecer todos los resultados combinados
            setResultados(allResults);
    
          } catch (error) {
            console.error('Error general:', error);
            setResultados([]);
          }
        };

    fetchData();
  }, [query, navigate]);

  console.log("Resultados en el render:", resultados);

  return (
    <div className="resultados-busqueda m-5">
      {loading && <p>Cargando resultados...</p>}
      {error && <p>Error: {error}</p>}
      {query && !loading && !error && resultados.length === 0 && (
        <p>No se encontraron artículos.</p>
      )}
      {resultados.length > 1 && (
        <>
          <h2 className="mb-5">Resultados para "{query}"</h2>
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