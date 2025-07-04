import { useEffect, useState } from "react";
import Cliente from "../../../models/Cliente.ts";
import {
    getClientesFiltrados,
    eliminarCliente,
    darDeAltaCliente,
    obtenerClientePorId
} from "../../../services/ClienteService.ts";
import { ReusableTable } from "../../Tabla";
import BotonVer from "../../layout/botones/BotonVer.tsx";
import BotonEliminar from "../../layout/botones/BotonEliminar.tsx";
import BotonAlta from "../../layout/botones/BotonAlta.tsx";
import { Modal, Form, Button } from "react-bootstrap";
import PedidoClienteModal from "../modales/PedidoClienteModal.tsx";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import pedidoService from "../../../services/PedidoService";


const GrillaCliente = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState("todos");
    const [ordenAsc, setOrdenAsc] = useState(true);
    // NUEVO: Estado para el tipo de ordenamiento
    const [tipoOrden, setTipoOrden] = useState<"nombre" | "pedidos">("nombre");
    const [loading, setLoading] = useState(false);
    const [pedidosPorCliente, setPedidosPorCliente] = useState<{ [clienteId: number]: number }>({});

    // Paginación
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const size = 10; // Tamaño de página fijo

    const [showPedidosModal, setShowPedidosModal] = useState(false);
    const [clientePedidos, setClientePedidos] = useState<Cliente | null>(null);

    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [mostrarDomicilios, setMostrarDomicilios] = useState(false);

    // Estados para modal de confirmación y resultado - NUEVOS
    const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);
    const [showModalResultado, setShowModalResultado] = useState(false);
    const [accionPendiente, setAccionPendiente] = useState<{
        tipo: 'eliminar' | 'alta';
        clienteId: number;
        clienteNombre: string;
    } | null>(null);
    const [mensajeResultado, setMensajeResultado] = useState("");
    const [tipoResultado, setTipoResultado] = useState<'success' | 'error'>('success');
    const [procesando, setProcesando] = useState(false);

    const cargarPedidosPorCliente = async (clientes: Cliente[]) => {
        // REMOVIDO: if (tipoOrden === "pedidos") return;
        // Siempre cargar los contadores de pedidos independientemente del tipo de orden

        const nuevosContadores: { [clienteId: number]: number } = {};
        await Promise.all(
            clientes.map(async (cliente) => {
                try {
                    const count = await pedidoService.getPedidosClienteCount(cliente.id!);
                    nuevosContadores[cliente.id!] = count;
                } catch (error) {
                    console.error(`Error al cargar pedidos para cliente ${cliente.id}:`, error);
                    nuevosContadores[cliente.id!] = 0;
                }
            })
        );
        setPedidosPorCliente(nuevosContadores);
    };

    const handleVerPedidos = (cliente: Cliente) => {
        setClientePedidos(cliente);
        setShowPedidosModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setClienteSeleccionado(null);
        setMostrarDomicilios(false);
    };

    // ACTUALIZADO: Cargar clientes con filtros y paginación
    const cargarClientes = async () => {
        try {
            setLoading(true);

            // Preparar filtros
            const filtros: {
                busqueda?: string;
                ordenar?: string;
                ordenarPorPedidos?: string;
                eliminado?: boolean;
            } = {};

            // Búsqueda unificada (nombre, apellido o email)
            if (search.trim() !== "") {
                filtros.busqueda = search.trim();
            }

            // Manejar correctamente el filtro de estado
            if (estado === "activos") {
                filtros.eliminado = false;
            } else if (estado === "inactivos") {
                filtros.eliminado = true;
            }

            // NUEVO: Configurar ordenamiento según el tipo seleccionado
            if (tipoOrden === "nombre") {
                filtros.ordenar = ordenAsc ? "asc" : "desc";
            } else if (tipoOrden === "pedidos") {
                filtros.ordenarPorPedidos = ordenAsc ? "asc" : "desc";
            }

            const result = await getClientesFiltrados(
                filtros,
                page,
                size
            );

            setClientes(result.content);

            // CAMBIO IMPORTANTE: Esperar a que se carguen los pedidos antes de quitar el loading
            await cargarPedidosPorCliente(result.content);

            setTotalPages(result.totalPages);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
            mostrarResultado("Error al cargar clientes", 'error');
        } finally {
            setLoading(false); // Solo se quita el loading cuando TODO esté cargado
        }
    };

    // ACTUALIZADO: Efecto para cargar clientes cuando cambian los filtros
    useEffect(() => {
        setPage(0); // Resetear a primera página cuando cambian los filtros
    }, [search, estado, ordenAsc, tipoOrden]);

    // Efecto para cargar clientes cuando cambia la página o los filtros
    useEffect(() => {
        cargarClientes();
    }, [page, search, estado, ordenAsc, tipoOrden]);

    // Nuevas funciones para manejo de modales - NUEVAS
    const mostrarConfirmacion = (tipo: 'eliminar' | 'alta', clienteId: number, clienteNombre: string) => {
        setAccionPendiente({
            tipo,
            clienteId,
            clienteNombre
        });
        setShowModalConfirmacion(true);
    };

    const mostrarResultado = (mensaje: string, tipo: 'success' | 'error') => {
        setMensajeResultado(mensaje);
        setTipoResultado(tipo);
        setShowModalResultado(true);
    };

    const ejecutarAccion = async () => {
        if (!accionPendiente) return;

        setProcesando(true);
        setShowModalConfirmacion(false);

        try {
            if (accionPendiente.tipo === 'eliminar') {
                await eliminarCliente(accionPendiente.clienteId);
                mostrarResultado("Cliente eliminado correctamente", 'success');
            } else {
                await darDeAltaCliente(accionPendiente.clienteId);
                mostrarResultado("Cliente dado de alta correctamente", 'success');
            }
            
            await cargarClientes();
        } catch (error) {
            const mensaje = accionPendiente.tipo === 'eliminar' 
                ? "Error al eliminar el cliente" 
                : "Error al dar de alta el cliente";
            mostrarResultado(mensaje, 'error');
        } finally {
            setProcesando(false);
            setAccionPendiente(null);
        }
    };

    const cancelarAccion = () => {
        setShowModalConfirmacion(false);
        setAccionPendiente(null);
    };

    // ACTUALIZADO: Reemplazar las funciones handleEliminar y handleAlta
    const handleEliminar = (cliente: Cliente) => {
        mostrarConfirmacion('eliminar', cliente.id!, `${cliente.nombre} ${cliente.apellido}`);
    };

    const handleAlta = (cliente: Cliente) => {
        mostrarConfirmacion('alta', cliente.id!, `${cliente.nombre} ${cliente.apellido}`);
    };

    const handleVer = async (cliente: Cliente) => {
        try {
            const data = await obtenerClientePorId(cliente.id!);
            setClienteSeleccionado(data);
            setShowModal(true);
        } catch (err) {
            mostrarResultado("Error al obtener los datos del cliente", 'error'); // ACTUALIZADO
        }
    };

    // NUEVO: Función para obtener el texto del botón de ordenamiento
    const getOrdenTexto = () => {
        if (tipoOrden === "nombre") {
            return `Nombre: ${ordenAsc ? "A-Z" : "Z-A"}`;
        } else {
            return `Pedidos: ${ordenAsc ? "Menos" : "Más"}`;
        }
    };

    const columns = [
        {
            key: "imagen",
            label: "Imagen",
            render: (_: any, row: Cliente) =>
                row.usuario.photoUrl ? (
                    <img
                        src={row.usuario.photoUrl}
                        alt="Foto"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                    />
                ) : (
                    "Sin imagen"
                ),
        },
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
            key: "pedidos",
            label: "Pedidos",
            render: (_: any, row: Cliente) => {
                const count = pedidosPorCliente[row.id!];
                return count !== undefined ? count : "Cargando...";
            },
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
                        <BotonEliminar onClick={() => handleEliminar(row)} /> // ACTUALIZADO
                    ) : (
                        <BotonAlta onClick={() => handleAlta(row)} /> // ACTUALIZADO
                    )}
                </div>
            ),
        }
    ];

    return (
        <div>
            <h2 className="m-3">Clientes</h2>

            {/* ACTUALIZADO: Filtros con nuevos controles de ordenamiento */}
            <div className="d-flex gap-3 mb-2 align-items-start ">
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ minWidth: "200px" }}
                />

                <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ minWidth: "120px" }}>
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </Form.Select>

                {/* NUEVO: Selector de tipo de ordenamiento */}
                <Form.Select
                    value={tipoOrden}
                    onChange={(e) => setTipoOrden(e.target.value as "nombre" | "pedidos")}
                    style={{ minWidth: "150px" }}
                >
                    <option value="nombre">Ordenar por Nombre</option>
                    <option value="pedidos">Ordenar por Pedidos</option>
                </Form.Select>

                {/* ACTUALIZADO: Botón de ordenamiento con texto dinámico */}
                <Button
                    variant="outline-secondary"
                    onClick={() => setOrdenAsc(!ordenAsc)}
                    style={{ minWidth: "150px" }}
                >
                    {getOrdenTexto()}
                </Button>
            </div>

            {/* Tabla con loading */}
            {loading ? (
                <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <>
                    <ReusableTable data={clientes} columns={columns} />

                    {/* Paginación */}
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <div className="text-muted">
                            Mostrando {clientes.length} clientes
                            {(search || estado !== "todos") && (
                                <span> (con filtros aplicados)</span>
                            )}
                            {/* NUEVO: Indicador del tipo de ordenamiento actual */}
                            <span className="ms-2 badge bg-secondary">
                                Ordenado por: {tipoOrden === "nombre" ? "Nombre" : "Cantidad de Pedidos"}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            >
                                <ChevronLeft />
                            </Button>
                            <span className="px-2">
                                Página {page + 1} de {totalPages || 1}
                            </span>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal de detalles del cliente */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Cliente # {clienteSeleccionado?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {clienteSeleccionado && (
                        <div className="container">
                            <div className="d-flex flex-column align-items-center mb-3">
                                {clienteSeleccionado.usuario.photoUrl ? (
                                    <img
                                        src={clienteSeleccionado.usuario.photoUrl}
                                        alt="Foto de perfil"
                                        className="rounded-circle"
                                        style={{ width: 100, height: 100, objectFit: "cover" }}
                                    />
                                ) : ("Sin imagen")}
                            </div>

                            <div className="mb-3">
                                <p><b>Nombre:</b> {clienteSeleccionado.nombre}</p>
                                <p><b>Apellido:</b> {clienteSeleccionado.apellido}</p>
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
                                <Button variant="primary" onClick={() => handleVerPedidos(clienteSeleccionado!)}>
                                    Ver Pedidos
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de pedidos del cliente */}
            {clientePedidos && (
                <PedidoClienteModal
                    show={showPedidosModal}
                    onHide={() => setShowPedidosModal(false)}
                    cliente={clientePedidos}
                />
            )}

            {/* Modal de Confirmación - NUEVO */}
            <Modal 
                show={showModalConfirmacion} 
                onHide={cancelarAccion} 
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {accionPendiente?.tipo === 'eliminar' ? 'Confirmar Eliminación' : 'Confirmar Alta'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <div className={`mb-3 ${accionPendiente?.tipo === 'eliminar' ? 'text-danger' : 'text-success'}`}>
                            <i className={`bi ${accionPendiente?.tipo === 'eliminar' ? 'bi-exclamation-triangle' : 'bi-check-circle'} display-1`}></i>
                        </div>
                        <h5>
                            {accionPendiente?.tipo === 'eliminar' 
                                ? '¿Está seguro que desea eliminar este cliente?' 
                                : '¿Está seguro que desea dar de alta este cliente?'
                            }
                        </h5>
                        <p className="text-muted">
                            <strong>{accionPendiente?.clienteNombre }</strong>
                        </p>
                        <p className="small text-muted">
                            {accionPendiente?.tipo === 'eliminar' 
                                ? 'Esta acción cambiará el estado del cliente a inactivo.' 
                                : 'Esta acción cambiará el estado del cliente a activo.'
                            }
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelarAccion} disabled={procesando}>
                        Cancelar
                    </Button>
                    <Button 
                        variant={accionPendiente?.tipo === 'eliminar' ? 'danger' : 'success'} 
                        onClick={ejecutarAccion}
                        disabled={procesando}
                    >
                        {procesando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Procesando...
                            </>
                        ) : (
                            accionPendiente?.tipo === 'eliminar' ? 'Eliminar' : 'Dar de Alta'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Resultado - NUEVO */}
            <Modal 
                show={showModalResultado} 
                onHide={() => setShowModalResultado(false)} 
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {tipoResultado === 'success' ? 'Operación Exitosa' : 'Error'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <div className={`mb-3 ${tipoResultado === 'success' ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${tipoResultado === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} display-1`}></i>
                        </div>
                        <h5>{mensajeResultado}</h5>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant={tipoResultado === 'success' ? 'success' : 'danger'} 
                        onClick={() => setShowModalResultado(false)}
                    >
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GrillaCliente;