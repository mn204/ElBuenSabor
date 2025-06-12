import { useEffect, useState } from "react";
import Empleado from "../../models/Empleado";
import {
    obtenerTodosLosEmpleados,
    eliminarEmpleado,
    darDeAltaEmpleado,
    obtenerEmpleadoPorId
} from "../../services/EmpleadoService";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonAlta from "../layout/BotonAlta";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import {darDeAltaUsuario, eliminarUsuario} from "../../services/UsuarioService.ts";
import BotonModificar from "../layout/BotonModificar.tsx";
import { useNavigate } from "react-router-dom";
import Sucursal from "../../models/Sucursal"; // asegurate de tener este modelo
import { obtenerSucursales } from "../../services/SucursalService"; // importá el servicio
import FormDatosEmpleado from "./FormDatosEmpleado";

const GrillaEmpleado = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [filteredEmpleados, setFilteredEmpleados] = useState<Empleado[]>([]);
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState("todos");
    const [rolFiltro, setRolFiltro] = useState("todos");
    const [ordenAsc, setOrdenAsc] = useState(true);
    const navigate = useNavigate();
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditar, setShowEditar] = useState(false);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [sucursalFiltro, setSucursalFiltro] = useState("todas");


    useEffect(() => {
        cargarEmpleados();
    }, []);

    useEffect(() => {
        const cargarSucursales = async () => {
            try {
                const data = await obtenerSucursales();
                setSucursales(data);
            } catch (error) {
                console.error("Error al cargar sucursales", error);
            }
        };

        cargarSucursales();
    }, []);

    useEffect(() => {
        filtrarEmpleados();
    }, [empleados, search, estado, rolFiltro, ordenAsc, sucursalFiltro]);


    const cargarEmpleados = async () => {
        try {
            const data = await obtenerTodosLosEmpleados();
            setEmpleados(data);
        } catch (error) {
            alert("Error al cargar empleados");
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

    const filtrarEmpleados = () => {
        let filtrados = [...empleados];

        if (estado !== "todos") {
            const eliminado = estado === "inactivos";
            filtrados = filtrados.filter(e => e.eliminado === eliminado);
        }

        if (rolFiltro !== "todos") {
            filtrados = filtrados.filter(e => e.usuario.rol === rolFiltro);
        }

        if (search.trim() !== "") {
            const texto = search.toLowerCase();
            filtrados = filtrados.filter(e =>
                `${e.nombre} ${e.apellido}`.toLowerCase().includes(texto) ||
                e.usuario?.email?.toLowerCase().includes(texto) ||
                e.usuario?.rol?.toLowerCase().includes(texto)
            );
        }
        if (sucursalFiltro !== "todas") {
            filtrados = filtrados.filter(e => e.sucursal?.id?.toString() === sucursalFiltro);
        }
        filtrados.sort((a, b) => {
            const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
            const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
            return ordenAsc ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
        });

        setFilteredEmpleados(filtrados);
    };

    const handleEliminar = async (id: number, idUsuario: number) => {
        if (!window.confirm("¿Seguro que desea eliminar este empleado?")) return;
        try {
            await eliminarEmpleado(id);
            await eliminarUsuario(idUsuario)
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
            render: (_: any, row: Empleado) => row.sucursal?.nombre,
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
                        <BotonEliminar onClick={() => handleEliminar(row.id! , row.usuario.id)} />
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
                    placeholder="Buscar por nombre, email o rol"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </Form.Select>

                <Form.Select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
                    <option value="todos">Todos los roles</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="COCINERO">Cocinero</option>
                    <option value="CAJERO">Cajero</option>
                    <option value="DELIVERY">Delivery</option>
                </Form.Select>

                <Form.Select value={sucursalFiltro} onChange={(e) => setSucursalFiltro(e.target.value)}>
                    <option value="todas">Todas las sucursales</option>
                    {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </Form.Select>

                <Button variant="outline-secondary" onClick={() => setOrdenAsc(!ordenAsc)}>
                    Orden: {ordenAsc ? "A-Z" : "Z-A"}
                </Button>
            </div>

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
                                <p><b>Sucursal:</b> {empleadoSeleccionado.sucursal?.nombre}</p>
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

            {empleadoSeleccionado && (
                <FormDatosEmpleado
                    show={showEditar}
                    onHide={() => setShowEditar(false)}
                    empleado={empleadoSeleccionado}
                    editableAdmin={true} // <--- ACÁ
                    onEmpleadoActualizado={(empleadoActualizado) => {
                        setEmpleados(prev =>
                            prev.map(e => e.id === empleadoActualizado.id ? empleadoActualizado : e)
                        );
                        setShowEditar(false);
                    }}
                />
            )}


            <ReusableTable data={filteredEmpleados} columns={columns} />
        </div>
    );
};

export default GrillaEmpleado;
