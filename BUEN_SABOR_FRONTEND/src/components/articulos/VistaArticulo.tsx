import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Articulo from "../../models/Articulo";
import { useCarrito } from "../../hooks/useCarrito";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";

const API_URL = "http://localhost:8080/api/productos";

const VistaArticulo: React.FC = () => {
  const { id } = useParams();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const carritoCtx = useCarrito();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) {
          ArticuloInsumoService.getById(Number(id))
          .then((data: Articulo) => {
            setArticulo(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
        }
        return res.json();
      })
      .then((data: Articulo) => {
        setArticulo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando artículo...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!articulo) return <p>No se encontró el artículo.</p>;
  const handleAgregarAlCarrito = () => {
    if (carritoCtx && articulo) {
      console.log(articulo)
      carritoCtx.agregarAlCarrito(articulo, 1);
    }
  };
  return (
    <div className="vista-articulo d-flex p-4 m-4 justify-content-center gap-4 text-start">
      <div className="imagen">
        <img
        src={articulo?.imagenes ? articulo.imagenes[0]?.denominacion : "/placeholder.png"}
        alt={articulo.denominacion}
        style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: 10 }}
        />
      </div>
      <div className="info-producto d-flex flex-column justify-content-around align-items-start">
        <h2>{articulo.denominacion}</h2>
        <p>{articulo.denominacion}</p>
        <p>Precio: ${articulo.precioVenta}</p>
        <button
          onClick={handleAgregarAlCarrito}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default VistaArticulo;