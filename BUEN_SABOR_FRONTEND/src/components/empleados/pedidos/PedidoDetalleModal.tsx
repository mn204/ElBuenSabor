import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import Pedido from "../../../models/Pedido.ts";
import { formatFechaConOffset } from "../../../funciones/formatFecha.ts";
import { Badge } from "react-bootstrap";
import Estado from "../../../models/enums/Estado.ts";
import Rol from "../../../models/enums/Rol.ts";
import { useAuth } from "../../../context/AuthContext.tsx";

interface Props {
  show: boolean;
  onHide: () => void;
  pedido: Pedido;
  onEstadoChange?: (pedidoId: number, nuevoEstado: Estado) => void;
}

const PedidoDetalleModal: React.FC<Props> = ({ show, onHide, pedido, onEstadoChange }) => {
  const { usuario } = useAuth();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Estado>(pedido.estado);

  const getColorEstado = (estado: Estado): string => {
    switch (estado) {
      case Estado.PENDIENTE:
        return "warning";
      case Estado.PREPARACION:
        return "info";
      case Estado.LISTO:
        return "primary";
      case Estado.EN_DELIVERY:
        return "secondary";
      case Estado.ENTREGADO:
        return "success";
      case Estado.CANCELADO:
        return "danger";
      default:
        return "light";
    }
  };

  const getEstadosDisponibles = (): Estado[] => {
    if (!usuario) return [];

    const estadoActual = pedido.estado;

    switch (usuario.rol) {
      case Rol.CLIENTE:
        // Solo puede cambiar de PENDIENTE a CANCELADO
        return estadoActual === Estado.PENDIENTE ? [Estado.CANCELADO] : [];

      case Rol.ADMIN:
        // Puede cambiar a cualquier estado
        return Object.values(Estado).filter(estado => estado !== estadoActual);

      case Rol.CAJERO:
        // Puede cambiar todos los estados, pero no puede volver a estados anteriores
        const estadosOrdenados = [
          Estado.PENDIENTE,
          Estado.PREPARACION,
          Estado.LISTO,
          Estado.EN_DELIVERY,
          Estado.ENTREGADO,
          Estado.CANCELADO
        ];

        const indiceActual = estadosOrdenados.indexOf(estadoActual);
        if (indiceActual === -1) return [];

        // Retorna estados posteriores al actual (sin incluir el actual)
        return estadosOrdenados.slice(indiceActual + 1);

      case Rol.COCINERO:
        // Solo puede cambiar de PREPARACION a LISTO
        return estadoActual === Estado.PREPARACION ? [Estado.LISTO] : [];

      case Rol.DELIVERY:
        // Solo puede cambiar de EN_DELIVERY a ENTREGADO
        return estadoActual === Estado.EN_DELIVERY ? [Estado.ENTREGADO] : [];

      default:
        return [];
    }
  };

  const estadosDisponibles = getEstadosDisponibles();

  const handleCambiarEstado = () => {
    if (onEstadoChange && estadoSeleccionado !== pedido.estado && pedido.id) {
      onEstadoChange(pedido.id, estadoSeleccionado);
      onHide();
    }
  };

  const puedeModificarEstado = estadosDisponibles.length > 0;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <Modal.Title className="mb-0">Detalle del Pedido #{pedido.id}</Modal.Title>
          <Badge bg={getColorEstado(pedido.estado)}>{pedido.estado}</Badge>
        </div>
      </Modal.Header>

      <Modal.Body>
        <p><strong>Fecha:</strong> {formatFechaConOffset(pedido.fechaPedido)}</p>
        <p><strong>Sucursal:</strong> {pedido.sucursal.nombre}</p>
        <p><strong>Forma de pago:</strong> {pedido.formaPago}</p>
        <p><strong>Forma de entrega:</strong> {pedido.tipoEnvio}</p>
        <p className="mb-0"><strong>Domicilio:</strong></p>
        {pedido.domicilio &&
          <p>
            {pedido.domicilio.detalles && <>Referencia: {pedido.domicilio.detalles}. </>}
            {pedido.domicilio.calle} {pedido.domicilio.numero}, CP {pedido.domicilio.codigoPostal}, {pedido.domicilio.localidad?.nombre}
            {pedido.domicilio.piso && `, Piso ${pedido.domicilio.piso}`}
            {pedido.domicilio.nroDepartamento && `, Depto ${pedido.domicilio.nroDepartamento}`}
          </p>
        }

        <Table striped bordered>
          <thead>
            <tr>
              <th>Artículo / Promoción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles.map((d, idx) => {
              const esArticulo = !!d.articulo?.denominacion;
              const esPromocion = !!d.promocion?.denominacion;

              const nombre = esArticulo
                ? d.articulo.denominacion
                : esPromocion
                  ? `🎁 Promo: ${d.promocion.denominacion}`
                  : "Sin nombre";

              const precioUnitario = esArticulo
                ? d.articulo.precioVenta?.toFixed(2)
                : esPromocion
                  ? d.promocion.precioPromocional.toFixed(2)
                  : "-";

              return (
                <tr key={idx}>
                  <td>{nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>${precioUnitario}</td>
                  <td>${d.subTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        {/* Cambio de estado minimalista */}
        <div className="d-flex align-items-center">
          {puedeModificarEstado && (
            <>
              <div className="position-relative me-2">
                <Badge
                  bg={getColorEstado(estadoSeleccionado)}
                  className="position-absolute"
                  style={{
                    top: "50%",
                    left: "8px",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    fontSize: "0.6rem",
                    padding: "2px 6px"
                  }}
                >
                  ●
                </Badge>
                <Form.Select
                  size="sm"
                  style={{
                    width: "200px",
                    paddingLeft: "28px",
                    border: `2px solid var(--bs-${getColorEstado(estadoSeleccionado)})`,
                    borderRadius: "6px"
                  }}
                  value={estadoSeleccionado}
                  onChange={(e) => setEstadoSeleccionado(e.target.value as Estado)}
                >
                  <option value={pedido.estado}>{pedido.estado}</option>
                  {estadosDisponibles.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <Button
                variant={`outline-${getColorEstado(estadoSeleccionado)}`}
                size="sm"
                onClick={handleCambiarEstado}
                disabled={estadoSeleccionado === pedido.estado}
                style={{ borderRadius: "6px" }}
              >
                Cambiar
              </Button>
            </>
          )}
        </div>

        {/* Botones de la derecha */}
        <div>
          <Button variant="secondary" onClick={onHide} className="me-2">
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => window.open(`http://localhost:8080/api/pedidos/cliente/${pedido.cliente.id}/pedido/${pedido.id}/factura`, '_blank')}
          >
            Descargar Factura
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PedidoDetalleModal;