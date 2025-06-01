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
    ArticuloManufacturadoService.buscarPorDenominacion(query)
      .then((data) => {
        if (data.length === 1) {
          navigate(`/articulo/${data[0].id}`);
        } else {
          setResultados(data);
          setLoading(false);
        }
      });
  }, [query, navigate]);

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