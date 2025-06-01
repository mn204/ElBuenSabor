import { useState } from "react";
import { Button, Image } from "react-bootstrap";
import Pedido from "../../models/Pedido";
import { useCarrito } from "../../hooks/useCarrito";

export function Carrito() {
  const carritoCtx = useCarrito();
  const [pedidoGuardado, setPedidoGuardado] = useState<Pedido | null>(null);
  if (!carritoCtx) return null;

  const {
    pedido,
    restarDelCarrito,
    agregarAlCarrito,
    quitarDelCarrito,
    limpiarCarrito,
    enviarPedido,
    guardarPedidoYObtener
  } = carritoCtx;

  const carrito = pedido.detalle;
  const handlePagarConMP = async () => {
    const pedidoFinal = await guardarPedidoYObtener();
    if (pedidoFinal) {
      setPedidoGuardado(pedidoFinal);
    }
    console.log(pedidoGuardado)
  };

  return (
    <div>
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          carrito.map((item) => (
            <div key={item.articulo.id} className="d-flex align-items-center mb-3 border-bottom pb-2">
              <Image
                src={item.articulo.imagenes[0]?.denominacion}
                alt={"Imagen del artículo"}
                style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px" }}
                rounded
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-2 pb-2">
                  <strong>{item.articulo.denominacion}</strong>
                  <Button
                    style={{ width: "30px", height: "30px" }}
                    variant="outline-danger"
                    size="sm"
                    onClick={() => quitarDelCarrito(item.articulo.id ? item.articulo.id : 0)}
                  >
                    X
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <small>Precio: ${item.articulo.precioVenta.toFixed(2)}</small>
                  <div className="d-flex align-items-center mx-2">
                    <Button
                      style={{ background: "red", color: "white" }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => restarDelCarrito(item.articulo.id ? item.articulo.id : 0)}
                    >
                      <strong>-</strong>
                    </Button>
                    <span className="mx-2">{item.cantidad}</span>
                    <Button
                      style={{ background: "green", color: "white" }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => agregarAlCarrito(item.articulo, 1)}
                    >
                      <strong>+</strong>
                    </Button>
                  </div>
                </div>
                <div>Subtotal: ${item.subTotal.toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
        {carrito.length > 0 && (
          <>
            <div className="mt-3 text-end">
              <strong>
                Total: $
                {carrito
                  .reduce((acc, item) => acc + item.subTotal, 0)
                  .toFixed(2)}
              </strong>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="warning" onClick={limpiarCarrito}>Limpiar carrito</Button>
              <Button variant="success" onClick={enviarPedido}>Guardar pedido</Button>
            </div>
            <div className="mt-3">
            <Button variant="primary" onClick={handlePagarConMP}>
              Pagar con Mercado Pago
            </Button>
            </div>
          </>
        )}
    </div>
  );
}
