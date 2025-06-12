import { useEffect, useState } from "react";
import Cliente from "../../models/Cliente";
import {
    obtenerTodosLosClientes,
    eliminarCliente,
    darDeAltaCliente,
    obtenerClientePorId
} from "../../services/ClienteService";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import BotonAlta from "../layout/BotonAlta.tsx";
import googleLogo from "../../assets/google_logo.png"; // ruta correcta según tu proyecto
import { Modal } from "react-bootstrap";
import {darDeAltaUsuario, eliminarUsuario} from "../../services/UsuarioService.ts";


//TODO implementar ver los pedidos del cliente.

const GrillaCliente = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState("todos");
    const [ordenAsc, setOrdenAsc] = useState(true);

    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [mostrarDomicilios, setMostrarDomicilios] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setClienteSeleccionado(null);
        setMostrarDomicilios(false);
    };


    useEffect(() => {
        cargarClientes();
    }, []);

    useEffect(() => {
        filtrarClientes();
    }, [clientes, search, estado, ordenAsc]);

    const cargarClientes = async () => {
        try {
            const data = await obtenerTodosLosClientes();
            setClientes(data);
        } catch (error) {
            alert("Error al cargar los clientes");
        }
    };

    const filtrarClientes = () => {
        let filtrados = [...clientes];

        if (estado !== "todos") {
            const eliminado = estado === "inactivos";
            filtrados = filtrados.filter(c => c.eliminado === eliminado);
        }

        if (search.trim() !== "") {
            const texto = search.toLowerCase();
            filtrados = filtrados.filter(c =>
                `${c.nombre} ${c.apellido}`.toLowerCase().includes(texto) ||
                c.usuario?.email?.toLowerCase().includes(texto)
            );
        }

        filtrados.sort((a, b) => {
            const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
            const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
            return ordenAsc ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
        });

        setFilteredClientes(filtrados);
    };

    const handleEliminar = async (id: number, idUsuario: number) => {
        if (!window.confirm("¿Seguro que desea eliminar este cliente?")) return;
        try {
            await eliminarCliente(id);
            await eliminarUsuario(idUsuario);
            await cargarClientes();
            alert("Cliente eliminado correctamente");
        } catch (error) {
            alert("Error al eliminar el cliente");
        }
    };

    const handleAlta = async (id: number, idUsuario: number) => {
        if (!window.confirm("¿Desea dar de alta este cliente?")) return;
        try {
            await darDeAltaCliente(id);
            await darDeAltaUsuario(idUsuario);
            await cargarClientes();
            alert("Cliente dado de alta correctamente");
        } catch (error) {
            alert("Error al dar de alta el cliente");
        }
    };

    const handleVer = async (cliente: Cliente) => {
        try {
            const data = await obtenerClientePorId(cliente.id!);
            setClienteSeleccionado(data);
            setShowModal(true);
        } catch (err) {
            alert("Error al obtener los datos del cliente");
        }
    };

    const columns = [
        {
            key: "id",
            label: "ID",
            render: (_: any, row: Cliente) => row.id,
        },
        {
            key: "nombreApellido",
            label: "Nombre y Apellido",
            render: (_: any, row: Cliente) => `${row.nombre} ${row.apellido}`,
        },
        {
            key: "email",
            label: "Email",
            render: (_: any, row: Cliente) => row.usuario?.email,
        },
        {
            key: "telefono",
            label: "Teléfono",
            render: (_: any, row: Cliente) => row.telefono,
        },
        {
            key: "estado",
            label: "Estado",
            render: (_: any, row: Cliente) => (row.eliminado ? "Inactivo" : "Activo"),
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: Cliente) => (
                <div className="d-flex justify-content-center gap-2">
                    <BotonVer onClick={() => handleVer(row)} />
                    {!row.eliminado ? (
                        <BotonEliminar onClick={() => handleEliminar(row.id!, row.usuario.id)} />
                    ) : (
                        <BotonAlta onClick={() => handleAlta(row.id!,row.usuario.id)} />
                    )}
                </div>
            ),
        }
    ];

    return (
        <div>
            <h2 className="m-3">Clientes</h2>

            <div className="d-flex gap-3 mb-2 align-items-start">
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </Form.Select>

                <Button variant="outline-secondary" onClick={() => setOrdenAsc(!ordenAsc)}>
                    Orden: {ordenAsc ? "A-Z" : "Z-A"}
                </Button>
            </div>

            <ReusableTable data={filteredClientes} columns={columns} />

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Cliente # {clienteSeleccionado?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {clienteSeleccionado && (
                        <div className="container">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <img
                                    src={
                                        clienteSeleccionado.usuario.providerId === "google.com"
                                            ? googleLogo
                                            : clienteSeleccionado.usuario.photoUrl
                                    }
                                    alt="Foto de perfil"
                                    className="rounded-circle"
                                    style={{ width: 100, height: 100, objectFit: "cover" }}
                                />
                            </div>

                            <div className="mb-3">
                                <p><b>Nombre:</b> {clienteSeleccionado.nombre}</p>
                                <p><b>Apellido:</b> {clienteSeleccionado.apellido}</p>
                                <p><b>DNI:</b> {clienteSeleccionado.usuario.dni}</p>
                                <p><b>Teléfono:</b> {clienteSeleccionado.telefono}</p>
                                <p><b>Email:</b> {clienteSeleccionado.usuario.email}</p>
                                <p><b>Proveedor:</b> {clienteSeleccionado.usuario.providerId === "google.com" ? "Google" : "Contraseña"}</p>
                                <p><b>Fecha Nacimiento:</b> {clienteSeleccionado.fechaNacimiento.split('-').reverse().join('/')}</p>
                            </div>

                            <div className="mt-3">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => setMostrarDomicilios(prev => !prev)}
                                    className="mb-2"
                                >
                                    {mostrarDomicilios ? "Ocultar domicilios" : "Mostrar domicilios"}
                                </Button>

                                {mostrarDomicilios && (
                                    <ul className="list-group">
                                        {clienteSeleccionado.domicilios.map((dom, idx) => (
                                            <li key={idx} className="list-group-item">
                                    <span>
                                        <b>{dom.detalles || "Sin referencia"}:</b> {dom.calle} {dom.numero}, CP {dom.codigoPostal} - {dom.localidad.nombre}, {dom.localidad.provincia.nombre}, {dom.localidad.provincia.pais.nombre}
                                    </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <Button variant="primary" disabled>
                                    Ver Pedidos (próximamente)
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default GrillaCliente;
