import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import Pedido from "../../models/Pedido";
import pedidoService from "../../services/PedidoService";
import { useAuth } from "../../context/AuthContext";
import PedidoDetalleModal from "../articulos/PedidoDetalleModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Estado from "../../models/enums/Estado";

const PedidoCliente: React.FC = () => {
    const { cliente } = useAuth();
    const [pedidos, setPedidos] = useState<{ content: Pedido[]; totalPages: number }>({ content: [], totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [detallePedido, setDetallePedido] = useState<Pedido | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [filtros, setFiltros] = useState({
        sucursal: "",
        estado: "",
        desde: null as Date | null,
        hasta: null as Date | null,
        articulo: "",
    });

    // Paginación
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchPedidos = async () => {
        try {
            if (!cliente) return;
            setLoading(true);

            // Preparar filtros para la API (conversión de fechas)
            const filtrosConvertidos = {
                ...filtros,
                desde: filtros.desde ? filtros.desde.toISOString() : null,
                hasta: filtros.hasta ? filtros.hasta.toISOString() : null,
            };

            const result = await pedidoService.getPedidosCliente(cliente.id!, filtrosConvertidos, page, size);
            setPedidos(result);
            setTotalPages(result.totalPages);
        } catch (err: any) {
            setError(err.message || "Error al obtener pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, [page]);

    const handleDetalle = async (pedidoId: number) => {
        try {
            const detalle = await pedidoService.getDetallePedido(cliente!.id!, pedidoId);
            setDetallePedido(detalle);
            setShowModal(true);
        } catch {
            alert("Error al obtener detalle del pedido");
        }
    };

    const handleDescargarFactura = async (pedidoId: number) => {
        try {
            const blob = await pedidoService.descargarFactura(cliente!.id!, pedidoId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factura_pedido_${pedidoId}.pdf`;
            a.click();
        } catch {
            alert("Error al descargar la factura");
        }
    };

    const handleFiltrar = () => {
        setPage(0); // Reiniciar a la primera página
        fetchPedidos();
    };

    return (
        <div className="container mt-4">
            <h2>Historial de pedidos</h2>

            <Form className="mb-3">
                <Row>
                    <Col>
                        <Form.Control
                            placeholder="Sucursal"
                            value={filtros.sucursal}
                            onChange={(e) => setFiltros({ ...filtros, sucursal: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <Form.Select
                            value={filtros.estado}
                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                        >
                            <option value="">Estado</option>
                            {Object.values(Estado).map((est) => (
                                <option key={est} value={est}>
                                    {est}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col>
                        <DatePicker
                            className="form-control"
                            placeholderText="Desde"
                            selected={filtros.desde}
                            onChange={(date) => setFiltros({ ...filtros, desde: date })}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    </Col>
                    <Col>
                        <DatePicker
                            className="form-control"
                            placeholderText="Hasta"
                            selected={filtros.hasta}
                            onChange={(date) => setFiltros({ ...filtros, hasta: date })}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            placeholder="Artículo"
                            value={filtros.articulo}
                            onChange={(e) => setFiltros({ ...filtros, articulo: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <Button onClick={handleFiltrar}>Filtrar</Button>
                    </Col>
                </Row>
            </Form>

            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Número</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.content.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>No hay pedidos</td>
                                </tr>
                            ) : (
                                pedidos.content.map((p: Pedido) => (
                                    <tr key={p.id}>
                                        <td>{new Date(p.fechaPedido).toLocaleString()}</td>
                                        <td>{p.id}</td>
                                        <td>${p.total.toFixed(2)}</td>
                                        <td>
                                            <Button size="sm" onClick={() => handleDetalle(p.id!)}>Ver detalle</Button>{" "}
                                            <Button size="sm" variant="secondary" onClick={() => handleDescargarFactura(p.id!)}>Factura</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Navegación de páginas */}
                    <div className="d-flex justify-content-between">
                        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</Button>
                        <span>Página {page + 1} de {totalPages}</span>
                        <Button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Siguiente</Button>
                    </div>
                </>
            )}

            {detallePedido && (
                <PedidoDetalleModal show={showModal} onHide={() => setShowModal(false)} pedido={detallePedido} />
            )}
        </div>
    );
};

export default PedidoCliente;