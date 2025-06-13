import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Articulo from "../models/Articulo";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/DetallePedido";
import PedidoService from "../services/PedidoService";
import Estado from "../models/enums/Estado";
import type Domicilio from "../models/Domicilio";
import DetallePedido from "../models/DetallePedido";
import ArticuloInsumo from "../models/ArticuloInsumo";
import type ArticuloManufacturado from "../models/ArticuloManufacturado";

interface CarritoContextProps {
  pedido: Pedido;
  preferenceId: string;
  agregarAlCarrito: (articulo: Articulo, cantidad: number) => void;
  quitarDelCarrito: (idArticulo: number) => void;
  restarDelCarrito: (idArticulo: number) => void;
  limpiarCarrito: () => void;
  enviarPedido:  () => Promise<Pedido | null | undefined>;
  AgregarPreferenceId: (id: string) => void;
  guardarPedidoYObtener: () => Promise<Pedido | null>;
}

export const carritoContext = createContext<CarritoContextProps | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [pedido, setPedido] = useState<Pedido>(() => {
  const pedidoGuardado = localStorage.getItem("carritoPedido");
  if (pedidoGuardado) {
    const json = JSON.parse(pedidoGuardado);
    const pedido = Object.assign(new Pedido(), json);
    pedido.detalles = (json.detalles || []).map((detalle: any) =>
      Object.assign(new PedidoDetalle(), {
        ...detalle,
        articulo: Object.assign(new Articulo(), detalle.articulo),
      })
    );
    return pedido;
  }

  const nuevoPedido = new Pedido();
  nuevoPedido.detalles = [];
  nuevoPedido.total = 0;
  nuevoPedido.estado = Estado.PENDIENTE;
  return nuevoPedido;
});
  const [preferenceId, setIdPreference ] = useState<string>("");

  const AgregarPreferenceId = (id: string) => {
    setIdPreference(id);
  }
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
const obtenerFechaArgentina = () => {
  const ahora = new Date();
  
  // Obtener fecha/hora Argentina
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const fechaString = formatter.format(ahora).replace(' ', 'T');
  
  // Crear fecha y restar 3 horas
  const fecha = new Date(fechaString);
  fecha.setHours(fecha.getHours() - 3);
  
  // Formatear de vuelta a string ISO
  return fecha.toISOString().slice(0, 19);
};
useEffect(() => {
  localStorage.setItem("carritoPedido", JSON.stringify(pedido));
}, [pedido]);
const obtenerHoraArgentina = () => {
  const fechaArgentina = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
  return fechaArgentina.toTimeString().split(' ')[0];
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
      console.log(obtenerFechaArgentina())

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
    nuevoPedido.fechaPedido = "";
    nuevoPedido.detalles = [];
    nuevoPedido.total = 0;
    setPedido(nuevoPedido);
    localStorage.removeItem("carritoPedido");
  };

  const enviarPedido = async () => {
    if (pedido.detalles.length === 0) {
      alert("El carrito está vacío. No se puede enviar el pedido.");
      return;
    }

    try {
      pedido.horaEstimadaFinalizacion = obtenerHoraArgentina();
      if(pedido.domicilio == null){
        pedido.domicilio = {id: 6} as Domicilio
      }
      const res = PedidoService.create(pedido)
      return res
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
      // Función para calcular el tiempo total de preparación
const calcularTiempoPreparacion = (pedido: Pedido): number => {
  let tiempoTotalMinutos = 0;
  
  for (const detalle of pedido.detalles) {
    const articulo = detalle.articulo;
    
    // Verificar si es un ArticuloManufacturado
    if ('tiempoEstimadoMinutos' in articulo) {
      const articuloManufacturado = articulo as ArticuloManufacturado || ArticuloInsumo;
      // Multiplicar el tiempo por la cantidad de ese artículo
      tiempoTotalMinutos += articuloManufacturado.tiempoEstimadoMinutos * detalle.cantidad;
    }
  }
  
  return tiempoTotalMinutos;
};

// Función para obtener la hora de finalización
const obtenerHoraFinalizacion = (pedido: Pedido): string => {
    const tiempoPreparacionMinutos = calcularTiempoPreparacion(pedido);
    
    // Obtener la hora actual en Argentina
    const ahora = new Date();
    const horaArgentina = new Date(ahora.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires"
    }));
    
    // Sumar los minutos de preparación
    horaArgentina.setMinutes(horaArgentina.getMinutes() + tiempoPreparacionMinutos);
    
    // Retornar en formato HH:mm:ss
    return horaArgentina.toTimeString().split(' ')[0];
  };

  // En tu código principal, reemplaza:
  // pedido.horaEstimadaFinalizacion = obtenerHoraArgentina();

  // Por:
  pedido.horaEstimadaFinalizacion = obtenerHoraFinalizacion(pedido);
      pedido.fechaPedido = obtenerFechaArgentina();
      const exito = await PedidoService.create(pedido);
      if (exito) {
        alert("Pedido guardado exitosamente");
        return exito; // o null si no necesitas retornar nada
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

  return (
    <carritoContext.Provider
      value={{
        pedido,
        preferenceId,
        agregarAlCarrito,
        restarDelCarrito,
        quitarDelCarrito,
        limpiarCarrito,
        enviarPedido,
        AgregarPreferenceId,
        guardarPedidoYObtener,
      }}
    >
      {children}
    </carritoContext.Provider>
  );
}