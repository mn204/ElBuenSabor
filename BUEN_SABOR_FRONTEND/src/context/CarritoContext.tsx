import { createContext, useState } from "react";
import type { ReactNode } from "react";
import Articulo from "../models/Articulo";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/DetallePedido";
import PedidoService from "../services/PedidoService";

interface CarritoContextProps {
  pedido: Pedido;
  agregarAlCarrito: (articulo: Articulo, cantidad: number) => void;
  quitarDelCarrito: (idArticulo: number) => void;
  restarDelCarrito: (idArticulo: number) => void;
  limpiarCarrito: () => void;
  enviarPedido: () => Promise<void>;
  guardarPedidoYObtener: () => Promise<Pedido | null>;
}

export const carritoContext = createContext<CarritoContextProps | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [pedido, setPedido] = useState<Pedido>(() => {
    const nuevoPedido = new Pedido();
    nuevoPedido.fechaPedido = new Date();
    nuevoPedido.detalle = [];
    nuevoPedido.total = 0;
    return nuevoPedido;
  });

  const agregarAlCarrito = (articulo: Articulo, cantidad: number) => {
  setPedido((prevPedido) => {
    const detalleExistente = prevPedido.detalle.find(
      (d) => d.articulo.id === articulo.id,
    );
    let nuevosdetalle: PedidoDetalle[];
    if (detalleExistente) {
      nuevosdetalle = prevPedido.detalle.map((d) => {
        if (d.articulo.id === articulo.id) {
          const nuevaCantidad = d.cantidad + cantidad;
          return {
            ...d,
            cantidad: nuevaCantidad,
            subTotal: articulo.precioVenta * nuevaCantidad, // <--- aquí
          };
        }
        return d;
      });
    } else {
      const nuevoDetalle = new PedidoDetalle();
      nuevoDetalle.articulo = articulo;
      nuevoDetalle.cantidad = cantidad;
      nuevoDetalle.subTotal = articulo.precioVenta * cantidad; // <--- aquí
      nuevosdetalle = [...prevPedido.detalle, nuevoDetalle];
    }

    const nuevoTotal = nuevosdetalle.reduce((acc, d) => acc + d.subTotal, 0); // <--- aquí
    return { ...prevPedido, detalle: nuevosdetalle, total: nuevoTotal };
  });
};

const restarDelCarrito = (idArticulo: number) => {
  setPedido((prevPedido) => {
    const nuevosdetalle = prevPedido.detalle
      .map((d) => {
        if (d.articulo.id === idArticulo) {
          const nuevaCantidad = d.cantidad - 1;
          if (nuevaCantidad <= 0) return null;
          return {
            ...d,
            cantidad: nuevaCantidad,
            subTotal: nuevaCantidad * d.articulo.precioVenta, // <--- aquí
          };
        }
        return d;
      })
      .filter((d): d is PedidoDetalle => d !== null);

    const nuevoTotal = nuevosdetalle.reduce((acc, d) => acc + d.subTotal, 0); // <--- aquí
    return { ...prevPedido, detalle: nuevosdetalle, total: nuevoTotal };
  });
};

  const quitarDelCarrito = (idArticulo: number) => {
    setPedido((prevPedido) => {
      const nuevosdetalle = prevPedido.detalle.filter(
        (d) => d.articulo.id !== idArticulo
      );
      const nuevoTotal = nuevosdetalle.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalle: nuevosdetalle, total: nuevoTotal };
    });
  };

  const limpiarCarrito = () => {
    const nuevoPedido = new Pedido();
    nuevoPedido.fechaPedido = new Date();
    nuevoPedido.detalle = [];
    nuevoPedido.total = 0;
    setPedido(nuevoPedido);
  };

  const enviarPedido = async () => {
    if (pedido.detalle.length === 0) {
      alert("El carrito está vacío. No se puede enviar el pedido.");
      return;
    }

    try {
      PedidoService.create(pedido)
      limpiarCarrito();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el pedido.");
    }
  };

  const guardarPedidoYObtener = async (): Promise<Pedido | null> => {
    if (pedido.detalle.length === 0) {
      alert("El carrito está vacío. No se puede guardar el pedido.");
      return null;
    }

    try {
      PedidoService.create(pedido)
      limpiarCarrito();
      const pedidoTemporal = new Pedido();
      return pedidoTemporal;
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el pedido.");
      return null;
    }
  };
  console.log(carritoContext)
  return (
    <carritoContext.Provider
      value={{
        pedido,
        agregarAlCarrito,
        restarDelCarrito,
        quitarDelCarrito,
        limpiarCarrito,
        enviarPedido,
        guardarPedidoYObtener,
      }}
    >
      {children}
    </carritoContext.Provider>
  );
}