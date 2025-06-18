import React, { useEffect, useState } from "react";
import { Button, Form, Spinner, Card } from "react-bootstrap";
import Pedido from "../../../models/Pedido.ts";
import Estado from "../../../models/enums/Estado.ts";
import pedidoService from "../../../services/PedidoService.ts";
import { ReusableTable } from "../../Tabla";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { formatFechaConOffset } from "../../../funciones/formatFecha.ts";
import { useAuth } from "../../../context/AuthContext.tsx";
import { useSucursal } from "../../../context/SucursalContextEmpleado.tsx";
import { obtenerSucursales } from "../../../services/SucursalService.ts";
import type Sucursal from "../../../models/Sucursal.ts";
import DeliveryModal from "../pedidos/DeliveryModal.tsx";

const GrillaDelivery: React.FC = () => {
    const { sucursalActual, esModoTodasSucursales, sucursalIdSeleccionada } = useSucursal();
    const { empleado, usuario } = useAuth();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [loading, setLoading] = useState(false);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
    const [showModal, setShowModal] = useState(false);


    // Filtros para admin
    const [filtros, setFiltros] = useState({
        deliveryNombre: "",
        sucursalFiltro: "" // Solo se usa cuando está en modo "todas las sucursales"
    });

    const isAdmin = usuario?.rol === 'ADMINISTRADOR';
    const isDelivery = usuario?.rol === 'DELIVERY';

    const handleAgregar5Min = async (pedido: Pedido) => {
        try {
            await pedidoService.agregarCincoMinutos(pedido);
            fetchPedidos();
            console.log("Hora estimada actualizada correctamente.");
        } catch (error) {
            console.error("Error al agregar 5 minutos:", error);
        }
    };

    const fetchPedidos = async () => {
        try {
            setLoading(true);

            let sucursalId: number | null = null;
            let idEmpleado: number | undefined = undefined;

            if (isAdmin) {
                // Para admin: usar el contexto de sucursal (puede ser null si está en modo "todas las sucursales")
                if (esModoTodasSucursales) {
                    // Si está en modo "todas" pero tiene filtro específico de sucursal
                    sucursalId = filtros.sucursalFiltro ? parseInt(filtros.sucursalFiltro) : null;
                } else {
                    // Si está viendo una sucursal específica desde el navbar
                    sucursalId = sucursalIdSeleccionada;
                }
                // Para admin no se pasa idEmpleado a menos que sea necesario filtrar por delivery específico
            } else if (isDelivery) {
                // Para delivery: solo su sucursal y sus pedidos asignados
                sucursalId = sucursalActual?.id || null;
                idEmpleado = empleado?.id;
            } else {
                // Otros roles no tienen acceso
                return;
            }

            const filtrosAPI = {
                estado: Estado.EN_DELIVERY,
                idEmpleado: idEmpleado
            };

            const result = await pedidoService.getPedidosFiltrados(
                sucursalId,
                filtrosAPI,
                page,
                size
            );

            // Si es admin y hay filtro por nombre de delivery, filtrar localmente
            let pedidosFiltrados = result.content;
            if (isAdmin && filtros.deliveryNombre) {
                pedidosFiltrados = result.content.filter(pedido => {
                    const nombreCompleto = `${pedido.empleado?.nombre || ''} ${pedido.empleado?.apellido || ''}`.toLowerCase();
                    return nombreCompleto.includes(filtros.deliveryNombre.toLowerCase());
                });
            }

            setPedidos(pedidosFiltrados);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error("Error al obtener pedidos en delivery:", error);
            alert("Error al obtener pedidos en delivery");
        } finally {
            setLoading(false);
        }
    };

    // Cargar sucursales para admin cuando está en modo "todas las sucursales"
    useEffect(() => {
        const fetchSucursales = async () => {
            if (isAdmin && esModoTodasSucursales) {
                try {
                    const sucursalesData = await obtenerSucursales();
                    setSucursales(sucursalesData);
                } catch (error) {
                    console.error("Error al cargar sucursales:", error);
                }
            }
        };

        if (usuario) {
            fetchSucursales();
        }
    }, [usuario, isAdmin, esModoTodasSucursales]);

    // Fetch pedidos cuando cambien los filtros, la página o el contexto de sucursal
    useEffect(() => {
        if ((isAdmin || (isDelivery && sucursalActual?.id)) && usuario) {
            fetchPedidos();
        }
    }, [page, filtros.deliveryNombre, filtros.sucursalFiltro, sucursalIdSeleccionada, sucursalActual?.id, usuario, isAdmin, isDelivery, esModoTodasSucursales]);

    const handleVerDetalle = async (pedidoId: number) => {
        try {
            const pedido = await pedidoService.getPedidoPorId(pedidoId);
            setPedidoSeleccionado(pedido);
            setShowModal(true);
        } catch (error) {
            alert("No se pudo obtener el detalle del pedido");
        }
    };


    const handleLimpiarFiltros = () => {
        setFiltros({
            deliveryNombre: "",
            sucursalFiltro: ""
        });
        setPage(0);
    };


    const columns = [
        {
            key: "numero",
            label: "Número",
            render: (_: any, row: Pedido) => row.id
        },
        {
            key: "cliente",
            label: "Cliente",
            render: (_: any, row: Pedido) => `${row.cliente.nombre} ${row.cliente.apellido}`
        },
        {
            key: "fecha",
            label: "Fecha",
            render: (_: any, row: Pedido) => new Date(row.fechaPedido).toLocaleDateString("es-ES")
        },
        {
            key: "horaEstimada",
            label: "Hora Llegada",
            render: (_: any, row: Pedido) => row.horaEstimadaFinalizacion || "No especificada"
        },
        // Columna de delivery solo visible para admin
        ...(isAdmin ? [{
            key: "delivery",
            label: "Delivery",
            render: (_: any, row: Pedido) => {
                if (row.empleado) {
                    return `${row.empleado.nombre} ${row.empleado.apellido}`;
                }
                return "No asignado";
            }
        }] : []),
        // Columna de sucursal solo visible para admin cuando está en modo "todas las sucursales"
        ...(isAdmin && esModoTodasSucursales ? [{
            key: "sucursal",
            label: "Sucursal",
            render: (_: any, row: Pedido) => {
                // Asumiendo que el pedido tiene información de sucursal
                // Si no está disponible en el modelo, podrías necesitar modificar la API
                return row.sucursal?.nombre || "No especificada";
            }
        }] : []),
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: Pedido) => (
                <div className="d-flex gap-2 justify-content-center align-items-center">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleVerDetalle(row.id!)}
                >
                    Ver Detalle
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleAgregar5Min(row)}
                    title="Agregar 5 minutos"
                >
                    +5 min
                </Button>
                </div>
            )
        }
    ];

    // Verificar permisos
    if (!isAdmin && !isDelivery) {
        return (
            <Card>
                <Card.Body>
                    <Card.Text className="text-center text-muted">
                        No tienes permisos para acceder a esta sección.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div className="container-fluid">

            {isAdmin && (
                <div className="mb-3">
                    <Form>
                        <div className="d-flex align-items-end flex-wrap gap-3">
                            {/* Campo Delivery */}
                            <Form.Group className="d-flex align-items-center" style={{ minWidth: "280px" }}>
                                <Form.Label className="me-2 mb-0">Delivery:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del delivery"
                                    value={filtros.deliveryNombre}
                                    onChange={(e) => setFiltros({ ...filtros, deliveryNombre: e.target.value })}
                                />
                            </Form.Group>

                            {/* Campo Sucursal (solo si está en modo todas las sucursales) */}
                            {esModoTodasSucursales && (
                                <Form.Group className="d-flex align-items-center" style={{ minWidth: "280px" }}>
                                    <Form.Label className="me-2 mb-0">Sucursal:</Form.Label>
                                    <Form.Select
                                        value={filtros.sucursalFiltro}
                                        onChange={(e) => {
                                            setFiltros({ ...filtros, sucursalFiltro: e.target.value });
                                            setPage(0);
                                        }}
                                    >
                                        <option value="">Todas</option>
                                        {sucursales.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}

                            {/* Botón limpiar */}
                            <div>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleLimpiarFiltros}
                                    disabled={!filtros.deliveryNombre && !filtros.sucursalFiltro}
                                >
                                    Limpiar Filtros
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            )}


            {/* Tabla de pedidos */}
            <div className="p-3 border rounded bg-white shadow-sm">
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted mb-0">
                            {isDelivery
                                ? "No tienes pedidos asignados en delivery en este momento"
                                : "No hay pedidos en delivery para el contexto actual"
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Responsive: Cards en dispositivos móviles, tabla en desktop */}
                        <div className="d-block d-md-none">
                            {/* Cards para móvil */}
                            {pedidos.map((pedido) => (
                                <div key={pedido.id} className="border rounded shadow-sm p-3 mb-3 bg-light">
                                    <div><strong>Pedido #</strong> {pedido.id}</div>
                                    <div><strong>Cliente:</strong> {pedido.cliente.nombre} {pedido.cliente.apellido}</div>
                                    <div><strong>Hora estimada:</strong> {pedido.horaEstimadaFinalizacion || "No especificada"}</div>
                                    <div className="mt-2 text-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleVerDetalle(pedido.id!)}
                                        >
                                            Ver detalle
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-none d-md-block">
                            {/* Tabla visible solo en desktop/tablets */}
                            <div className="table-responsive">
                                <ReusableTable data={pedidos} columns={columns} />
                            </div>
                        </div>

                        {/* Paginación visible en todos los tamaños */}
                        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                            <div className="text-muted">
                                Mostrando {pedidos.length} pedidos
                                {isAdmin && (filtros.deliveryNombre || filtros.sucursalFiltro) && (
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
            </div>
            <DeliveryModal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setPedidoSeleccionado(null);
                    fetchPedidos(); // Refrescar lista después de entregar
                }}
                pedido={pedidoSeleccionado}
            />

        </div>
    );
};

export default GrillaDelivery;