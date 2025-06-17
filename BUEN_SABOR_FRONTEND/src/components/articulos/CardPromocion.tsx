import React from "react";
import { useNavigate } from "react-router-dom";
import Promocion from "../../models/Promocion";
import { useCarrito } from "../../hooks/useCarrito";

interface Props {
    promocion: Promocion;
}

const CardPromocion: React.FC<Props> = ({ promocion }) => {
    const carritoCtx = useCarrito();
    const handleAgregarAlCarrito = () => {
        if (carritoCtx && promocion) {
            carritoCtx.agregarPromocionAlCarrito(promocion);
        }
    };
    const navigate = useNavigate();
    return (
        <div
            className="card-promocion"
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                width: "200px",
                cursor: "pointer",
            }}
        >
            <img
                src={promocion?.imagenes[0]?.denominacion || "/placeholder.png"}
                alt={promocion.denominacion || "Artículo sin imagen"}
                style={{ width: "100%", height: "120px", objectFit: "cover" }}
                onClick={() => navigate(`/promocion/${promocion.id}`)}
            />
            <h6>{promocion.denominacion}</h6>
            <p>${promocion.precioPromocional}</p>
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

export default CardPromocion;