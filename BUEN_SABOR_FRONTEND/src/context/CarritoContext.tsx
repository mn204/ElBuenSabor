import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Articulo from "../models/Articulo";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/DetallePedido";
import PedidoService from "../services/PedidoService";
import Estado from "../models/enums/Estado";
import type Domicilio from "../models/Domicilio";
import ArticuloInsumo from "../models/ArticuloInsumo";
import type ArticuloManufacturado from "../models/ArticuloManufacturado";
import Promocion from "../models/Promocion";

interface CarritoContextProps {
  pedido: Pedido;
  preferenceId: string;
  agregarAlCarrito: (articulo: Articulo, cantidad: number, promocion?: Promocion) => void;
  // AGREGAR ESTAS NUEVAS FUNCIONES:
  agregarPromocionAlCarrito: (promocion: Promocion) => void;
  restarPromocionDelCarrito: (promocionId: number) => void;
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
  const agregarAlCarrito = (articulo: Articulo, cantidad: number, promocion?: Promocion) => {
    setPedido((prevPedido) => {
      // Si viene con promoción, usar la lógica específica para promociones
      if (promocion) {
        return agregarItemConPromocion(prevPedido, articulo, cantidad, promocion);
      }

      // Lógica original para artículos sin promoción
      const detallesExistente = prevPedido.detalles.find(
        (d) => d.articulo.id === articulo.id && !d.promocion
      );

      let nuevosdetalles: PedidoDetalle[];
      if (detallesExistente) {
        nuevosdetalles = prevPedido.detalles.map((d) => {
          if (d.articulo.id === articulo.id && !d.promocion) {
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
    setPedido((prevPedido) => {
      let nuevosPedidoDetalles = [...prevPedido.detalles];

      // Por cada artículo en la promoción, agregarlo al carrito
      promocion.detalles.forEach(detallePromo => {
        const existingIndex = nuevosPedidoDetalles.findIndex(
          d => d.articulo.id === detallePromo.articulo.id && d.promocion?.id === promocion.id
        );

        if (existingIndex >= 0) {
          // Si ya existe, incrementar la cantidad según la cantidad de la promoción
          nuevosPedidoDetalles[existingIndex].cantidad += detallePromo.cantidad;
          console.log(nuevosPedidoDetalles[existingIndex].cantidad)
        } else {
          // Si no existe, crear nuevo detalle
          const nuevoDetalle = new PedidoDetalle();
          nuevoDetalle.articulo = detallePromo.articulo;
          nuevoDetalle.cantidad = detallePromo.cantidad;
          nuevoDetalle.promocion = promocion;
          nuevosPedidoDetalles.push(nuevoDetalle);
        }
      });

      // Recalcular subtotales después de agregar todos los artículos
      nuevosPedidoDetalles = nuevosPedidoDetalles.map(detalle => {
        if (detalle.promocion?.id === promocion.id) {
          const detallePromocion = promocion.detalles.find(dp => dp.articulo.id === detalle.articulo.id);
          const cantidadEnPromocion = detallePromocion ? detallePromocion.cantidad : 1;
          const promocionesCompletas = Math.floor(detalle.cantidad / cantidadEnPromocion);

          return {
            ...detalle,
            subTotal: (promocion.precioPromocional / promocion.detalles.length) * promocionesCompletas
          };
        }
        return detalle;
      });

      const nuevoTotal = nuevosPedidoDetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosPedidoDetalles, total: nuevoTotal };
    });
  };

  const restarPromocionDelCarrito = useCallback((promocionId: number) => {
    setPedido((prevPedido) => {
      const itemsPromocion = prevPedido.detalles.filter(d => d.promocion?.id === promocionId);

      if (itemsPromocion.length === 0) return prevPedido;

      const promocion = itemsPromocion[0].promocion!;
      let nuevosDetalles = [...prevPedido.detalles];

      promocion.detalles.forEach(detallePromo => {
        const index = nuevosDetalles.findIndex(
          d => d.articulo.id === detallePromo.articulo.id && d.promocion?.id === promocionId
        );
        if (index >= 0) {
          const cantidadARestar = detallePromo.cantidad;
          const nuevaCantidad = nuevosDetalles[index].cantidad - cantidadARestar;

          if (nuevaCantidad <= 0) {
            nuevosDetalles.splice(index, 1);
          } else {
            nuevosDetalles[index].cantidad = nuevaCantidad;
            const promocionesCompletas = Math.floor(nuevaCantidad / cantidadARestar);
            nuevosDetalles[index].subTotal = (promocion.precioPromocional / promocion.detalles.length) * promocionesCompletas;
          }
        }
      });

      const nuevoTotal = nuevosDetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosDetalles, total: nuevoTotal };
    });
  }, []);


  // Función corregida para quitar promoción completa del carrito
  const quitarPromocionCompleta = (promocionId: number) => {
    setPedido((prevPedido) => {
      const nuevosDetalles = prevPedido.detalles.filter(d => d.promocion?.id !== promocionId);
      const nuevoTotal = nuevosDetalles.reduce((acc, d) => acc + d.subTotal, 0);
      return { ...prevPedido, detalles: nuevosDetalles, total: nuevoTotal };
    });
  };

  // También corrige la función agregarItemConPromocion para manejar correctamente el subtotal
  const agregarItemConPromocion = (pedido: Pedido, articulo: Articulo, cantidad: number, promocion: Promocion) => {
    const detallesExistente = pedido.detalles.find(
      (d) => d.articulo.id === articulo.id && d.promocion?.id === promocion.id
    );

    let nuevosdetalles: PedidoDetalle[];
    if (detallesExistente) {
      nuevosdetalles = pedido.detalles.map((d) => {
        if (d.articulo.id === articulo.id && d.promocion?.id === promocion.id) {
          const nuevaCantidad = d.cantidad + cantidad;
          // Encontrar cuántas veces este artículo aparece en la promoción
          const detallePromocion = promocion.detalles.find(dp => dp.articulo.id === articulo.id);
          const cantidadEnPromocion = detallePromocion ? detallePromocion.cantidad : 1;
          // Calcular promociones completas
          const promocionesCompletas = Math.floor(nuevaCantidad / cantidadEnPromocion);

          return {
            ...d,
            cantidad: nuevaCantidad,
            subTotal: (promocion.precioPromocional / promocion.detalles.length) * promocionesCompletas,
            promocion: promocion
          };
        }
        return d;
      });
    } else {
      const nuevoDetalles = new PedidoDetalle();
      nuevoDetalles.articulo = articulo;
      nuevoDetalles.cantidad = cantidad;
      nuevoDetalles.promocion = promocion;
      // Calcular subtotal como proporción del precio promocional
      nuevoDetalles.subTotal = promocion.precioPromocional / promocion.detalles.length;
      nuevosdetalles = [...pedido.detalles, nuevoDetalles];
    }

    const nuevoTotal = nuevosdetalles.reduce((acc, d) => acc + d.subTotal, 0);
    return { ...pedido, detalles: nuevosdetalles, total: nuevoTotal };
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
    setPedido((prevPedido) => {
      const nuevosdetalles = prevPedido.detalles
        .map((d) => {
          // Solo afectar artículos SIN promoción
          if (d.articulo.id === idArticulo && !d.promocion) {
            const nuevaCantidad = d.cantidad - 1;
            if (nuevaCantidad <= 0) return null;
            return {
              ...d,
              cantidad: nuevaCantidad,
              subTotal: nuevaCantidad * d.articulo.precioVenta,
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
    setPedido((prevPedido) => {
      // Solo quitar artículos SIN promoción
      const nuevosdetalles = prevPedido.detalles.filter(
        (d) => !(d.articulo.id === idArticulo && !d.promocion)
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
        restarPromocionDelCarrito,        // NUEVO
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