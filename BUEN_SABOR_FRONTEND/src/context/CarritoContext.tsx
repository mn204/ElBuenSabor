import { createContext, useState } from "react";
import type { ReactNode } from "react";
import Articulo from "../models/Articulo";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/DetallePedido";
import PedidoService from "../services/PedidoService";
import Estado from "../models/enums/Estado";

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
    const hoy = new Date();
    const soloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    nuevoPedido.fechaPedido = soloFecha;
    nuevoPedido.detalles = [];
    nuevoPedido.total = 0;
    nuevoPedido.estado = Estado.PENDIENTE;
    return nuevoPedido;
  });

  const agregarAlCarrito = (articulo: Articulo, cantidad: number) => {
  setPedido((prevPedido) => {
    const detallesExistente = prevPedido.detalles.find(
      (d) => d.articulo.id === articulo.id,
    );
    let nuevosdetalles: PedidoDetalle[];
    if (detallesExistente) {
      nuevosdetalles = prevPedido.detalles.map((d) => {
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
      const nuevoDetalles = new PedidoDetalle();
      nuevoDetalles.articulo = articulo;
      nuevoDetalles.cantidad = cantidad;
      nuevoDetalles.subTotal = articulo.precioVenta * cantidad; // <--- aquí
      nuevosdetalles = [...prevPedido.detalles, nuevoDetalles];
    }

    const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0); // <--- aquí
    return { ...prevPedido, detalles: nuevosdetalles, total: nuevoTotal };
  });
};

const restarDelCarrito = (idArticulo: number) => {
  setPedido((prevPedido) => {
    const nuevosdetalles = prevPedido.detalles
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

    const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0); // <--- aquí
    return { ...prevPedido, detalles: nuevosdetalles, total: nuevoTotal };
  });
};

  const quitarDelCarrito = (idArticulo: number) => {
    setPedido((prevPedido) => {
      const nuevosdetalles = prevPedido.detalles.filter(
        (d) => d.articulo.id !== idArticulo
      );
      const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosdetalles, total: nuevoTotal };
    });
  };

  const limpiarCarrito = () => {
    const nuevoPedido = new Pedido();
    nuevoPedido.fechaPedido = new Date();
    nuevoPedido.detalles = [];
    nuevoPedido.total = 0;
    setPedido(nuevoPedido);
  };

  const enviarPedido = async () => {
    if (pedido.detalles.length === 0) {
      alert("El carrito está vacío. No se puede enviar el pedido.");
      return;
    }

    try {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().split(' ')[0];
      pedido.horaEstimadaFinalizacion = horaActual;
      PedidoService.create(pedido)
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el pedido.");
    }
  };

  const guardarPedidoYObtener = async (): Promise<Pedido | null> => {
    if (pedido.detalles.length === 0) {
      alert("El carrito está vacío. No se puede guardar el pedido.");
      return null;
    }

    try {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().split(' ')[0];
      pedido.horaEstimadaFinalizacion = horaActual;

      const exito = await PedidoService.create(pedido);
      console.log(pedido)
      if (exito) {
        alert("Pedido guardado exitosamente");
        return pedido; // o null si no necesitas retornar nada
      } else {
        console.log("❌ Entrando en rama FAILURE - Stock insuficiente");
        alert("No se pudo procesar el pedido. Verifique el stock disponible.");
        return null;
      }
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