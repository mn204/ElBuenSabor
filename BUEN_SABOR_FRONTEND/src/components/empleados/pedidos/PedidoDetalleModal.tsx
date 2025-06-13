import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import Pedido from "../../../models/Pedido.ts";
import {formatFechaConOffset} from "../../../funciones/formatFecha.ts";
import { Badge } from "react-bootstrap";
import Estado from "../../../models/enums/Estado.ts";

interface Props {
  show: boolean;
  onHide: () => void;
  pedido: Pedido;
}

const PedidoDetalleModal: React.FC<Props> = ({ show, onHide, pedido }) => {
  const getColorEstado = (estado: Estado) => {
    switch (estado) {
      case Estado.PENDIENTE: return "warning";
      case Estado.ENTREGADO: return "success";
      case Estado.PREPARACION: return "info";
      case Estado.CANCELADO: return "secondary";
      case Estado.RECHAZADO: return "danger";
      default: return "light";
    }
  };

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
        <p>
          {pedido.domicilio.detalles && <>Referencia: {pedido.domicilio.detalles}. </>}
          {pedido.domicilio.calle} {pedido.domicilio.numero}, CP {pedido.domicilio.codigoPostal}, {pedido.domicilio.localidad.nombre}
          {pedido.domicilio.piso && `, Piso ${pedido.domicilio.piso}`}
          {pedido.domicilio.nroDepartamento && `, Depto ${pedido.domicilio.nroDepartamento}`}
        </p>

        <Table striped bordered>
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles.map((d, idx) => (
              <tr key={idx}>
                <td>{d.articulo.denominacion}</td>
                <td>{d.cantidad}</td>
                <td>${d.articulo.precioVenta?.toFixed(2) ?? ""}</td>
                <td>${d.subTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        <Button variant="primary" onClick={() => window.open(`http://localhost:8080/api/pedidos/cliente/${pedido.cliente.id}/pedido/${pedido.id}/factura`, '_blank')}>Descargar Factura</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PedidoDetalleModal;