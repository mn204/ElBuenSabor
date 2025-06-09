import { useState } from "react";
import { Container, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import type Domicilio from "../../models/Domicilio";
import ModalDomicilio from "./ModalDomicilio";

const Domicilios = () => {
    const { cliente, setCliente } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const domicilios = cliente?.domicilios || [];

    const handleAgregar = () => {
        setDomicilioSeleccionado(null);
        setShowModal(true);
        setError(null);
    };

    const handleEditar = (domicilio: Domicilio) => {
        setDomicilioSeleccionado(domicilio);
        setShowModal(true);
        setError(null);
    };

    const handleEliminar = async (domicilio: Domicilio) => {
        if (!cliente || !domicilio.id) return;

        const confirmacion = window.confirm(
            `¿Estás seguro de que querés eliminar el domicilio de ${domicilio.calle} ${domicilio.numero}?`
        );

        if (!confirmacion) return;

        setLoading(true);
        setError(null);

        try {
            const clienteActualizado = await eliminarDomicilioDeCliente(cliente.id!, domicilio.id);

            if (clienteActualizado) {
                setCliente(clienteActualizado);
            } else {
                setError("Error al eliminar el domicilio. Intentá nuevamente.");
            }
        } catch (error) {
            console.error("Error al eliminar domicilio:", error);
            setError("Error al eliminar el domicilio. Intentá nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = (clienteActualizado: any) => {
        setCliente(clienteActualizado);
        setShowModal(false);
        setDomicilioSeleccionado(null);
    };

    const formatearDomicilio = (domicilio: Domicilio) => {
        let direccion = `${domicilio.calle} ${domicilio.numero}`;

        if (domicilio.piso) {
            direccion += `, Piso ${domicilio.piso}`;
        }

        if (domicilio.nroDepartamento) {
            direccion += `, Depto ${domicilio.nroDepartamento}`;
        }

        direccion += ` - CP ${domicilio.codigoPostal}, ${domicilio.localidad?.nombre}`;

        if (domicilio.localidad?.provincia?.nombre) {
            direccion += `, ${domicilio.localidad.provincia.nombre}`;
        }

        return direccion;
    };

    if (!cliente) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Necesitás estar logueado como cliente para ver tus domicilios.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center fw-bold mb-4">Mis Domicilios</h2>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <div className="d-flex justify-content-start mb-4">
                <Button variant="dark" onClick={handleAgregar} disabled={loading}>
                    <FaPlus className="me-2" />
                    Agregar dirección
                </Button>
            </div>

            {domicilios.length === 0 ? (
                <Alert variant="info" className="text-center">
                    <h5>No tenés domicilios registrados</h5>
                    <p>Agregá tu primera dirección para realizar pedidos.</p>
                </Alert>
            ) : (
                domicilios.map((domicilio) => (
                    <Card key={domicilio.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={9}>
                                    <h5 className="mb-1 fw-semibold">
                                        {domicilio.localidad?.nombre || "Dirección"}
                                    </h5>
                                    <p className="mb-1">
                                        {formatearDomicilio(domicilio)}
                                    </p>
                                    {domicilio.detalles && (
                                        <p className="mb-0 text-muted small">
                                            <strong>Detalles:</strong> {domicilio.detalles}
                                        </p>
                                    )}
                                </Col>
                                <Col md={3} className="text-end">
                                    <Button
                                        variant="outline-dark"
                                        className="me-2"
                                        onClick={() => handleEditar(domicilio)}
                                        disabled={loading}
                                        size="sm"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleEliminar(domicilio)}
                                        disabled={loading}
                                        size="sm"
                                    >
                                        <FaTrash />
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            )}

            <ModalDomicilio
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setDomicilioSeleccionado(null);
                }}
                onSubmit={handleGuardar}
                domicilioActual={domicilioSeleccionado}
                cliente={cliente}
            />
        </Container>
    );
};

export default Domicilios;