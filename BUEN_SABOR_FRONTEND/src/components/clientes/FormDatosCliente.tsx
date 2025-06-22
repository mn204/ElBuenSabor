import { useState, useEffect } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import type Cliente from "../../models/Cliente.ts";
import { actualizarCliente } from "../../services/ClienteService.ts";

interface Props {
    show: boolean;
    onHide: () => void;
    cliente: Cliente;
    onClienteActualizado: (clienteActualizado: Cliente) => void;
}

const FormDatosCliente = ({ show, onHide, cliente, onClienteActualizado }: Props) => {
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [telefono, setTelefono] = useState("");

    // Cargar datos iniciales del cliente
    useEffect(() => {
        if (cliente && show) {
            setNombre(cliente.nombre || "");
            setApellido(cliente.apellido || "");
            setTelefono(cliente.telefono || "");
            
            // Formatear fecha para el input date
            if (cliente.fechaNacimiento) {
                const fecha = new Date(cliente.fechaNacimiento);
                const fechaFormateada = fecha.toISOString().split('T')[0];
                setFechaNacimiento(fechaFormateada);
            }
        }
    }, [cliente, show]);

    // Limpiar mensajes cuando se abre el modal
    useEffect(() => {
        if (show) {
            setFormError(null);
            setSuccessMessage(null);
        }
    }, [show]);



    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setTelefono(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre || !apellido || !fechaNacimiento || !telefono) {
            setFormError("Por favor completá todos los campos.");
            return;
        }



        setLoading(true);
        setFormError(null);
        setSuccessMessage(null);

        try {

            const clienteActualizado: Cliente = {
                ...cliente,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                fechaNacimiento: new Date(fechaNacimiento),
                usuario: {
                    ...cliente.usuario!
                }
            };

            const response = await actualizarCliente(cliente.id!, clienteActualizado);

            if (response) {
                setSuccessMessage("¡Datos actualizados correctamente!");
                onClienteActualizado(response);
                
                // Cerrar modal después de 1.5 segundos
                setTimeout(() => {
                    onHide();
                }, 1500);
            } else {
                setFormError("Error al actualizar los datos. Intentá nuevamente.");
            }

        } catch (error: any) {
            console.error("Error al actualizar cliente:", error);
            setFormError(error.message || "Error al actualizar los datos.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton={!loading}>
                <Modal.Title>Editar Datos Personales</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="nombre" className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="apellido" className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </Form.Group>


                    <Form.Group controlId="fechaNacimiento" className="mb-3">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            disabled={loading}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="telefono" className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={handleTelefonoChange}
                            disabled={loading}
                            required
                        />
                    </Form.Group>

                    {formError && (
                        <Alert variant="danger" className="mb-3">
                            {formError}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert variant="success" className="mb-3">
                            {successMessage}
                        </Alert>
                    )}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={loading }
                >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FormDatosCliente;