import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Articulo from "../../models/Articulo";
import { useCarrito } from "../../hooks/useCarrito";

interface Props {
  articulo: Articulo;
}

const CardArticulo: React.FC<Props> = ({ articulo }) => {
  const carritoCtx = useCarrito();
  const [isLoading, setIsLoading] = useState(false);

  const handleAgregarAlCarrito = () => {
    setIsLoading(true)
    if (carritoCtx && articulo.id) {
      console.log(articulo)
      carritoCtx.agregarAlCarrito(articulo, 1);
    }
    setIsLoading(false)
  };
  const navigate = useNavigate();
  console.log(articulo)
  return (
    <div
      className="card-articulo text-start"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        width: "fit-content",
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
        disabled={isLoading}
        className={`card-promocion__button ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Agregando...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="m1 1 4 4 14 1-1 12H6" />
            </svg>
            Agregar al carrito
          </>
        )}
      </button>
    </div>

  );
};

export default CardArticulo;