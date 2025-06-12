import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import Pedido from "../../models/Pedido";

interface Props {
  show: boolean;
  onHide: () => void;
  pedido: Pedido;
}

const PedidoDetalleModal: React.FC<Props> = ({ show, onHide, pedido }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalle del Pedido #{pedido.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
        <p><strong>Forma de pago:</strong> {pedido.formaPago}</p>
        <p><strong>Forma de entrega:</strong> {pedido.tipoEnvio}</p>

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