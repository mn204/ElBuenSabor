import { useEffect, useState } from "react";
import Empleado from "../../models/Empleado";
import {
    eliminarEmpleado,
    darDeAltaEmpleado,
    obtenerEmpleadoPorId,
    getEmpleadosFiltrados // <-- Nuevo import
} from "../../services/EmpleadoService";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonAlta from "../layout/BotonAlta";
import { Modal , Form, Button} from "react-bootstrap";
import { darDeAltaUsuario, eliminarUsuario } from "../../services/UsuarioService.ts";
import BotonModificar from "../layout/BotonModificar.tsx";
import { useNavigate } from "react-router-dom";
import Sucursal from "../../models/Sucursal";
import { obtenerSucursales } from "../../services/SucursalService";
import FormDatosEmpleado from "./FormDatosEmpleado";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons"; // <-- Para iconos de paginación

const GrillaEmpleado = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState("todos");
    const [rolFiltro, setRolFiltro] = useState("todos");
    const [ordenAsc, setOrdenAsc] = useState(true);
    const [sucursalFiltro, setSucursalFiltro] = useState("todas");

    // Estados para paginación
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const size = 10; // Tamaño de página fijo

    const navigate = useNavigate();
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditar, setShowEditar] = useState(false);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    useEffect(() => {
        cargarSucursales();
    }, []);

    // Cargar empleados cuando cambien los filtros o la página
    useEffect(() => {
        cargarEmpleados();
    }, [search, estado, rolFiltro, ordenAsc, sucursalFiltro, page]);

    const cargarSucursales = async () => {
        try {
            const data = await obtenerSucursales();
            setSucursales(data);
        } catch (error) {
            console.error("Error al cargar sucursales", error);
        }
    };

    const cargarEmpleados = async () => {
        try {
            setLoading(true);

            // Preparar sucursalId
            let sucursalId: number | null = null;
            if (sucursalFiltro !== "todas") {
                sucursalId = parseInt(sucursalFiltro);
            }

            // Preparar filtros
            const filtros: {
                busqueda?: string;
                rol?: string;
                ordenar?: string;
                eliminado?: boolean;
            } = {};

            // Búsqueda unificada (nombre, apellido o email)
            if (search.trim() !== "") {
                filtros.busqueda = search.trim();
            }

            if (rolFiltro !== "todos") {
                filtros.rol = rolFiltro;
            }

            // Manejar correctamente el filtro de estado
            if (estado === "activos") {
                filtros.eliminado = false;
            } else if (estado === "inactivos") {
                filtros.eliminado = true;
            }
            // Si estado === "todos", no asignamos filtros.eliminado (queda undefined)

            // Configurar ordenamiento
            filtros.ordenar = ordenAsc ? "asc" : "desc";

            const result = await getEmpleadosFiltrados(
                sucursalId,
                filtros,
                page,
                size
            );

            setEmpleados(result.content);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error("Error al cargar empleados:", error);
            alert("Error al cargar empleados");
        } finally {
            setLoading(false);
        }
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setEmpleadoSeleccionado(null);
    };

    const handleVer = async (empleado: Empleado) => {
        try {
            const data = await obtenerEmpleadoPorId(empleado.id!);
            setEmpleadoSeleccionado(data);
            setShowModal(true);
        } catch (err) {
            alert("Error al obtener los datos del empleado");
        }
    };

    const handleEliminar = async (id: number, idUsuario: number) => {
        if (!window.confirm("¿Seguro que desea eliminar este empleado?")) return;
        try {
            await eliminarEmpleado(id);
            await eliminarUsuario(idUsuario);
            await cargarEmpleados();
            alert("Empleado eliminado correctamente");
        } catch (error) {
            alert("Error al eliminar el empleado");
        }
    };

    const handleAlta = async (id: number, idUsuario: number) => {
        if (!window.confirm("¿Desea dar de alta este empleado?")) return;
        try {
            await darDeAltaEmpleado(id);
            await darDeAltaUsuario(idUsuario);
            await cargarEmpleados();
            alert("Empleado dado de alta correctamente");
        } catch (error) {
            alert("Error al dar de alta el empleado");
        }
    };

    // Resetear página cuando cambien los filtros
    const handleFiltroChange = (callback: () => void) => {
        setPage(0);
        callback();
    };

    const columns = [
        {
            key: "id",
            label: "ID",
            render: (_: any, row: Empleado) => row.id,
        },
        {
            key: "nombreApellido",
            label: "Nombre y Apellido",
            render: (_: any, row: Empleado) => `${row.nombre} ${row.apellido}`,
        },
        {
            key: "email",
            label: "Email",
            render: (_: any, row: Empleado) => row.usuario?.email,
        },
        {
            key: "telefono",
            label: "Teléfono",
            render: (_: any, row: Empleado) => row.telefono,
        },
        {
            key: "rol",
            label: "Rol",
            render: (_: any, row: Empleado) => row.usuario?.rol,
        },
        {
            key: "sucursal",
            label: "Sucursal",
            render: (_: any, row: Empleado) => row.sucursal?.nombre || "Sin asignar",
        },
        {
            key: "estado",
            label: "Estado",
            render: (_: any, row: Empleado) => (row.eliminado ? "Inactivo" : "Activo"),
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: Empleado) => (
                <div className="d-flex justify-content-center gap-2">
                    <BotonVer onClick={() => handleVer(row)} />
                    <BotonModificar onClick={() => {
                        setEmpleadoSeleccionado(row);
                        setShowEditar(true);
                    }} />

                    {!row.eliminado ? (
                        <BotonEliminar onClick={() => handleEliminar(row.id!, row.usuario.id)} />
                    ) : (
                        <BotonAlta onClick={() => handleAlta(row.id!, row.usuario.id)} />
                    )}
                </div>
            ),
        }
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center m-3">
                <h2>Empleados</h2>
                <Button variant="warning" onClick={() => navigate("/admin/nuevo-empleado/")}>
                    Nuevo Empleado
                </Button>
            </div>

            <div className="d-flex gap-3 mb-2 align-items-start">
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o email"
                    value={search}
                    onChange={(e) => handleFiltroChange(() => setSearch(e.target.value))}
                />

                <Form.Select
                    value={estado}
                    onChange={(e) => handleFiltroChange(() => setEstado(e.target.value))}
                >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </Form.Select>

                <Form.Select
                    value={rolFiltro}
                    onChange={(e) => handleFiltroChange(() => setRolFiltro(e.target.value))}
                >
                    <option value="todos">Todos los roles</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="COCINERO">Cocinero</option>
                    <option value="CAJERO">Cajero</option>
                    <option value="DELIVERY">Delivery</option>
                </Form.Select>

                <Form.Select
                    value={sucursalFiltro}
                    onChange={(e) => handleFiltroChange(() => setSucursalFiltro(e.target.value))}
                >
                    <option value="todas">Todas las sucursales</option>
                    {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </Form.Select>

                <Button
                    variant="outline-secondary"
                    onClick={() => handleFiltroChange(() => setOrdenAsc(!ordenAsc))}
                >
                    Orden: {ordenAsc ? "A-Z" : "Z-A"}
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <p>Cargando empleados...</p>
                </div>
            ) : (
                <>
                    <ReusableTable data={empleados} columns={columns} />

                    {/* Paginación */}
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <div className="text-muted">
                            Mostrando {empleados.length} empleados
                            {(search || estado !== "todos" || rolFiltro !== "todos" || sucursalFiltro !== "todas") && (
                                <span> (con filtros aplicados)</span>
                            )}
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

            {/* Modal Ver Empleado */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Empleado # {empleadoSeleccionado?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {empleadoSeleccionado && (
                        <div className="container">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <img
                                    src={empleadoSeleccionado.usuario.photoUrl}
                                    alt="Foto de perfil"
                                    className="rounded-circle"
                                    style={{ width: 100, height: 100, objectFit: "cover" }}
                                />
                            </div>

                            <div className="mb-3">
                                <p><b>Nombre:</b> {empleadoSeleccionado.nombre}</p>
                                <p><b>Apellido:</b> {empleadoSeleccionado.apellido}</p>
                                <p><b>DNI:</b> {empleadoSeleccionado.usuario.dni}</p>
                                <p><b>Teléfono:</b> {empleadoSeleccionado.telefono}</p>
                                <p><b>Email:</b> {empleadoSeleccionado.usuario.email}</p>
                                <p><b>Rol:</b> {empleadoSeleccionado.usuario.rol}</p>
                                <p><b>Sucursal:</b> {empleadoSeleccionado.sucursal?.nombre || "Sin asignar"}</p>
                                <p><b>Proveedor:</b> Contraseña</p>
                                <p><b>Fecha Nacimiento:</b> {empleadoSeleccionado.fechaNacimiento.split('-').reverse().join('/')}</p>
                                <p><b>Domicilio:</b> <b>{empleadoSeleccionado.domicilio.detalles || "Sin referencia"}:</b>{" "}
                                    {empleadoSeleccionado.domicilio.calle} {empleadoSeleccionado.domicilio.numero},{" "}
                                    Piso {empleadoSeleccionado.domicilio.piso}, Dpto. {empleadoSeleccionado.domicilio.nroDepartamento} –{" "}
                                    CP {empleadoSeleccionado.domicilio.codigoPostal} -{" "}
                                    {empleadoSeleccionado.domicilio.localidad.nombre},{" "}
                                    {empleadoSeleccionado.domicilio.localidad.provincia.nombre},{" "}
                                    {empleadoSeleccionado.domicilio.localidad.provincia.pais.nombre}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Editar Empleado */}
            {empleadoSeleccionado && (
                <FormDatosEmpleado
                    show={showEditar}
                    onHide={() => setShowEditar(false)}
                    empleado={empleadoSeleccionado}
                    editableAdmin={true}
                    onEmpleadoActualizado={(empleadoActualizado) => {
                        // Recargar la grilla para reflejar los cambios
                        cargarEmpleados();
                        setShowEditar(false);
                    }}
                />
            )}
        </div>
    );
};

export default GrillaEmpleado;