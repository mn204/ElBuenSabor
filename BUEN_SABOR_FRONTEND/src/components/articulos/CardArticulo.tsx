import React from "react";
import { useNavigate } from "react-router-dom";
import Articulo from "../../models/Articulo";
import { useCarrito } from "../../hooks/useCarrito";

interface Props {
  articulo: Articulo;
}

const CardArticulo: React.FC<Props> = ({ articulo }) => {
    const carritoCtx = useCarrito();
  
  const handleAgregarAlCarrito = () => {
    if (carritoCtx && articulo.id) {
      console.log(articulo)
      carritoCtx.agregarAlCarrito(articulo, 1);
    }
  };
  const navigate = useNavigate();
  console.log(articulo)
  return (
    <div
      className="card-articulo"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        width: "200px",
        cursor: "pointer",
      }}
    >
      <img
        src={articulo.imagenes[0]?.denominacion || "/placeholder.png"}
        alt={articulo.denominacion || "Artículo sin imagen"}
        style={{ width: "100%", height: "120px", objectFit: "cover" }}
        onClick={() => navigate(`/articulo/${articulo.id}`)}
      />
      <h6>{articulo.denominacion}</h6>
      <p>${articulo.precioVenta}</p>
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
    
  );
};

export default CardArticulo;