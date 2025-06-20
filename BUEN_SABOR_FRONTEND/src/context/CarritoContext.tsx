import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Articulo from "../models/Articulo";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/DetallePedido";
import PedidoService from "../services/PedidoService";
import Estado from "../models/enums/Estado";
import type Domicilio from "../models/Domicilio";
import Promocion from "../models/Promocion";
import ArticuloManufacturadoService from "../services/ArticuloManufacturadoService";
import TipoEnvio from "../models/enums/TipoEnvio";

interface CarritoContextProps {
  pedido: Pedido;
  preferenceId: string;
  agregarAlCarrito: (articulo: Articulo, cantidad: number) => void;
  // AGREGAR ESTAS NUEVAS FUNCIONES:
  agregarPromocionAlCarrito: (promocion: Promocion) => void;
  quitarPromocionCompleta: (promocionId: number) => void;
  quitarDelCarrito: (idArticulo: number) => void;
  restarDelCarrito: (idArticulo: number) => void;
  limpiarCarrito: () => void;
  enviarPedido: () => Promise<Pedido | null | undefined>;
  AgregarPreferenceId: (id: string) => void;
  guardarPedidoYObtener: () => Promise<Pedido | null>;
  limpiarPreferenceId: () => void;
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
  const [preferenceId, setIdPreference] = useState<string>("");

  const AgregarPreferenceId = (id: string) => {
    setIdPreference(id);
  }
  // 2. MODIFICAR LA FUNCIÓN agregarAlCarrito EXISTENTE
  const agregarAlCarrito = (articulo: Articulo, cantidad: number) => {
    if (!articulo.id) {
      console.warn("El artículo no tiene ID");
      return;
    }

    setPedido((prevPedido) => {
      const detallesExistente = prevPedido.detalles.find(
        (d) => d.articulo && d.articulo.id === articulo.id
      );

      let nuevosdetalles: PedidoDetalle[];
      if (detallesExistente) {
        nuevosdetalles = prevPedido.detalles.map((d) => {
          if (d.articulo && d.articulo.id === articulo.id && !d.promocion) {
            const nuevaCantidad = d.cantidad + cantidad;
            return {
              ...d,
              cantidad: nuevaCantidad,
              subTotal: articulo.precioVenta * nuevaCantidad,
            };
          }
          return d;
        });
      } else {
        const nuevoDetalles = new PedidoDetalle();
        nuevoDetalles.articulo = articulo;
        nuevoDetalles.cantidad = cantidad;
        nuevoDetalles.subTotal = articulo.precioVenta * cantidad;
        nuevosdetalles = [...prevPedido.detalles, nuevoDetalles];
      }

      const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosdetalles, total: nuevoTotal };
    });
  };


  const agregarPromocionAlCarrito = (promocion: Promocion) => {
    if (!promocion.id) {
      console.warn("El artículo no tiene ID");
      return;
    }
    setPedido((prevPedido) => {
      // Lógica original para artículo
      const detallesExistente = prevPedido.detalles.find(
        (d) => d.promocion?.id === promocion.id
      );

      let nuevosdetalles: PedidoDetalle[];
      if (detallesExistente) {
        nuevosdetalles = prevPedido.detalles.map((d) => {
          if (d.promocion?.id === promocion.id) {
            const nuevaCantidad = d.cantidad + 1;
            return {
              ...d,
              cantidad: nuevaCantidad,
              subTotal: promocion.precioPromocional * nuevaCantidad,
            };
          }
          return d;
        });
      } else {
        const nuevoDetalles = new PedidoDetalle();
        nuevoDetalles.promocion = promocion;
        nuevoDetalles.cantidad = 1;
        nuevoDetalles.subTotal = promocion.precioPromocional;
        nuevosdetalles = [...prevPedido.detalles, nuevoDetalles];
      }

      const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosdetalles, total: nuevoTotal };
    });
  };
  // Función corregida para quitar promoción completa del carrito
  const quitarPromocionCompleta = (promocionId: number) => {
    if (!promocionId) {
      console.warn("El artículo no tiene ID");
      return;
    }
    setPedido((prevPedido) => {
      // Solo quitar artículos SIN promoción
      const nuevosdetalles = prevPedido.detalles.filter(
        (d) => !(d.promocion?.id === promocionId)
      );
      const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0);
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
    const fechaArgentina = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    return fechaArgentina.toTimeString().split(' ')[0];
  };
  const restarDelCarrito = (idArticulo: number) => {
    if (!idArticulo) {
      console.warn("El artículo no tiene ID");
      return;
    }
    setPedido((prevPedido) => {
      const nuevosdetalles = prevPedido.detalles
        .map((d) => {
          // Solo afectar artículos SIN promoción
          if (d.articulo && d.articulo.id && d.articulo!.id === idArticulo && !d.promocion) {
            const nuevaCantidad = d.cantidad - 1;
            if (nuevaCantidad <= 0) return null;
            return {
              ...d,
              cantidad: nuevaCantidad,
              subTotal: nuevaCantidad * d.articulo!.precioVenta,
            };
          } else if (d.promocion?.id === idArticulo) {
            const nuevaCantidad = d.cantidad - 1;
            if (nuevaCantidad <= 0) return null;
            return {
              ...d,
              cantidad: nuevaCantidad,
              subTotal: nuevaCantidad * d.promocion.precioPromocional,
            };
          }
          return d;
        })
        .filter((d): d is PedidoDetalle => d !== null);

      const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosdetalles, total: nuevoTotal };
    });
  };
  const limpiarPreferenceId = () => {
    setIdPreference(undefined as any); // Forzar el tipo si es necesario
  };
  const quitarDelCarrito = (idArticulo: number) => {
    if (!idArticulo) {
      console.warn("El artículo no tiene ID");
      return;
    }
    setPedido((prevPedido) => {
      // Solo quitar artículos SIN promoción
      const nuevosdetalles = prevPedido.detalles.filter(
        (d) => !(d.articulo && d.articulo.id && d.articulo.id === idArticulo && !d.promocion)
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
    setIdPreference("");
  };

  const enviarPedido = async () => {
    if (pedido.detalles.length === 0) {
      alert("El carrito está vacío. No se puede enviar el pedido.");
      return;
    }

    try {
      pedido.horaEstimadaFinalizacion = obtenerHoraArgentina();
      if (pedido.domicilio == null) {
        pedido.domicilio = { id: 6 } as Domicilio
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
      const calcularTiempoPreparacion = async (pedido: Pedido): Promise<number> => {
        let tiempoTotalMinutos = 0;
        if (pedido.tipoEnvio == TipoEnvio.DELIVERY) {
          tiempoTotalMinutos += 15
        }
        console.log(pedido.tipoEnvio)
        if (pedido.detalles) {
          for (const det of pedido.detalles) {
            if (det.articulo) {
              try {
                const prod = await ArticuloManufacturadoService.getById(det.articulo.id);
                tiempoTotalMinutos += prod.tiempoEstimadoMinutos ?? 0;
              } catch (error) {
                console.error("Error al obtener artículo manufacturado:", error);
              }
            }
            if (det.promocion) {
              for (const deta of det.promocion.detalles) {
                try {
                  const prod = await ArticuloManufacturadoService.getById(deta.articulo!.id);
                  tiempoTotalMinutos += prod.tiempoEstimadoMinutos ?? 0;
                } catch (error) {
                  console.error("Error al obtener artículo manufacturado:", error);
                }
              }
            }
          }
        }

        return tiempoTotalMinutos;
      };


      // Función para obtener la hora de finalización
      const obtenerHoraFinalizacion = async (pedido: Pedido): Promise<string> => {
        const tiempoPreparacionMinutos = await calcularTiempoPreparacion(pedido);

        // Obtener la hora actual en Argentina
        const ahora = new Date();
        const horaArgentina = new Date(
          ahora.toLocaleString("en-US", {
            timeZone: "America/Argentina/Buenos_Aires",
          })
        );

        // Sumar los minutos de preparación
        horaArgentina.setMinutes(horaArgentina.getMinutes() + tiempoPreparacionMinutos);

        // Retornar en formato HH:mm:ss
        return horaArgentina.toTimeString().split(" ")[0];
      };

      // En tu código principal, reemplaza:
      // pedido.horaEstimadaFinalizacion = obtenerHoraArgentina();

      // Por:
      pedido.horaEstimadaFinalizacion = await obtenerHoraFinalizacion(pedido);
      pedido.fechaPedido = obtenerFechaArgentina();
      pedido.estado = Estado.PENDIENTE;
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
        limpiarPreferenceId,
        agregarAlCarrito,
        agregarPromocionAlCarrito,        // NUEVO
        quitarPromocionCompleta,          // NUEVO
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