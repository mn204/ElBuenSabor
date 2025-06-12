// DomiciliosCliente.tsx
import { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Domicilio from "../../models/Domicilio";
import ModalDomicilio from "./ModalDomicilio";
import { eliminarDomiciliosCliente } from "../../services/ClienteService.ts";

const DomiciliosCliente = () => {
    const { cliente, setCliente } = useAuth();
    const domicilios: Domicilio[] = cliente?.domicilios || [];

    const [modalVisible, setModalVisible] = useState(false);
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio | null>(null);

    const handleAgregar = () => {
        setDomicilioSeleccionado(null);
        setModalVisible(true);
    };

    const handleEditar = (domicilio: Domicilio) => {
        setDomicilioSeleccionado(domicilio);
        setModalVisible(true);
    };

    const handleEliminar = async (domicilio: Domicilio) => {
        if (!cliente || !domicilio.id) return;

        const confirmacion = window.confirm("¿Estás seguro que querés eliminar este domicilio?");
        if (!confirmacion) return;

        try {
            await eliminarDomiciliosCliente(cliente.id, domicilio.id);

            // Filtrar domicilio eliminado del estado actual del cliente
            const nuevosDomicilios = cliente.domicilios?.filter(d => d.id !== domicilio.id) || [];

            // Actualizar cliente sin el domicilio eliminado
            setCliente({
                ...cliente,
                domicilios: nuevosDomicilios
            });
        } catch (error) {
            console.error("Error al eliminar domicilio:", error);
            alert("Ocurrió un error al intentar eliminar el domicilio.");
        }
    };


    const handleModalSubmit = (clienteActualizado: any) => {
        setCliente(clienteActualizado);
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center fw-bold mb-4 perfilTitle">Mis Domicilios</h2>

            <div className="d-flex justify-content-start mb-3">
                <Button variant="dark" size="sm" onClick={handleAgregar}>
                    <FaPlus className="me-2" />
                    Agregar dirección
                </Button>
            </div>

            {domicilios.length === 0 ? (
                <p className="text-center">No tenés domicilios registrados.</p>
            ) : (
                domicilios.map((domicilio) => (
                    <Card key={domicilio.id} className="mb-2 shadow-sm" >
                        <Card.Body className="py-2 px-3">
                            <Row className="align-items-start">
                                <Col xs={12} md={9}>
                                    <h6 className="fw-semibold mb-1">{domicilio.detalles || "Domicilio sin detalles"}</h6>
                                    <small className="text-muted">
                                        {domicilio.calle} {domicilio.numero}
                                        {domicilio.piso ? `, Piso ${domicilio.piso}` : ""}
                                        {domicilio.nroDepartamento ? `, Dpto. ${domicilio.nroDepartamento}` : ""}
                                        {" - "}CP {domicilio.codigoPostal}, {domicilio.localidad?.nombre}
                                    </small>
                                </Col>
                                <Col xs={12} md={3} className="text-md-end mt-2 mt-md-0">
                                    <Button
                                        variant="outline-dark"
                                        size="sm"
                                        className="me-2 mb-1"
                                        onClick={() => handleEditar(domicilio)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-dark"
                                        size="sm"
                                        className="mb-1"
                                        onClick={() => handleEliminar(domicilio)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            )}

            {/* Modal para agregar/editar */}
            {cliente && (
                <ModalDomicilio
                    show={modalVisible}
                    onHide={() => setModalVisible(false)}
                    onSubmit={handleModalSubmit}
                    domicilioActual={domicilioSeleccionado}
                    cliente={cliente}
                />
            )}
        </Container>
    );
};

export default DomiciliosCliente;