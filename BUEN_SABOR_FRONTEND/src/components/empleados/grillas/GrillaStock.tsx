import { useState, useEffect } from "react";
import SucursalInsumoService from "../../../services/SucursalInsumoService.ts";
import { obtenerSucursales } from "../../../services/SucursalService.ts";
import type Sucursal from "../../../models/Sucursal.ts";
import type SucursalInsumo from "../../../models/SucursalInsumo.ts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ReusableTable } from "../../Tabla";
import BotonVer from "../../layout/botones/BotonVer.tsx";
import BotonModificar from "../../layout/botones/BotonModificar.tsx";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useSucursal } from "../../../context/SucursalContextEmpleado.tsx";
import ModalMensaje from "../modales/ModalMensaje";
import { Card, CardTitle } from "react-bootstrap";

// Tipo para manejar los datos en la tabla
interface StockTableRow {
    id: number;
    insumoNombre: string;
    sucursalNombre: string;
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
    sucursalInsumo: SucursalInsumo;
}

function GrillaStock() {
    const navigate = useNavigate();
    const { sucursalActual } = useSucursal();
    const [sucursalInsumos, setSucursalInsumos] = useState<SucursalInsumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Modal Ver
    const [showModal, setShowModal] = useState(false);
    const [stockSeleccionado, setStockSeleccionado] = useState<StockTableRow | null>(null);
    // Modal Agregar Stock
    const [showModalAgregar, setShowModalAgregar] = useState(false);
    const [stockParaAgregar, setStockParaAgregar] = useState<StockTableRow | null>(null);
    const [cantidadAgregar, setCantidadAgregar] = useState<number>(0);
    const [loadingAgregar, setLoadingAgregar] = useState(false);

    // Filtros
    const [filtroInsumo, setFiltroInsumo] = useState("");
    const [filtroSucursal, setFiltroSucursal] = useState("");
    const [filtroStockBajo, setFiltroStockBajo] = useState(false);
    const [filtroStockAlto, setFiltroStockAlto] = useState(false);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    // Estado para modal profesional
    const [modalMensaje, setModalMensaje] = useState({
        show: false,
        mensaje: "",
        titulo: "Mensaje",
        variante: "success" as "primary" | "success" | "danger" | "warning" | "info" | "secondary"
    });
    const mostrarModalMensaje = (mensaje: string, variante: typeof modalMensaje.variante = "success", titulo = "Mensaje") => {
        setModalMensaje({ show: true, mensaje, variante, titulo });
    };

    const cargarSucursales = async () => {
        try {
            const sucursalesData = await obtenerSucursales();
            setSucursales(sucursalesData);
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };



    useEffect(() => {
        cargarStockInsumos();
        cargarSucursales();
    }, [filtroInsumo, filtroSucursal, filtroStockBajo, filtroStockAlto, page]);

    // Resetear página cuando cambien los filtros
    useEffect(() => {
        setPage(0);
    }, [filtroInsumo, filtroSucursal, filtroStockBajo, filtroStockAlto]);

    const cargarStockInsumos = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                idSucursal: filtroSucursal ? Number(filtroSucursal) : undefined,
                nombreInsumo: filtroInsumo || undefined,
                stockActualMenorAStockMinimo: filtroStockBajo ? true : undefined,
                stockActualMayorAStockMaximo: filtroStockAlto ? true : undefined,
                page,
                size,
                sort: "articuloInsumo.denominacion,asc"
            };
            const data = await SucursalInsumoService.getFiltrados(params);
            setSucursalInsumos(data.content); // data.content es el array de resultados
            setTotalPaginas(data.totalPages); // si usas paginación
        } catch (error) {
            setError("Error al cargar el stock");
        } finally {
            setLoading(false);
        }
    };

    // Convertir SucursalInsumo a formato de tabla
    const convertirAFilasDeTabla = (sucursalInsumos: SucursalInsumo[]): StockTableRow[] => {
        return sucursalInsumos.map(item => ({
            id: item.id || 0,
            insumoNombre: item.articuloInsumo?.denominacion || "Sin nombre",
            sucursalNombre: item.sucursal?.nombre || "Sin sucursal",
            stockActual: item.stockActual || 0,
            stockMinimo: item.stockMinimo || 0,
            stockMaximo: item.stockMaximo || 0,
            sucursalInsumo: item
        }));
    };

    const handleVer = (fila: StockTableRow) => {
        setStockSeleccionado(fila);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setStockSeleccionado(null);
    };

    const handleActualizarStock = (fila: StockTableRow) => {
        // Redirigir a formulario para actualizar el stock
        if (sucursalActual && sucursalActual.id) {
            window.location.href = `/FormularioStock?id=${fila.sucursalInsumo.id}`;
        } else {
            mostrarModalMensaje("Debes seleccionar una sucursal antes de actualizar el stock.", "warning", "Advertencia");
        }
    };

    // Manejar modal agregar stock
    const handleAgregarStock = (fila: StockTableRow) => {
        setStockParaAgregar(fila);
        setCantidadAgregar(0);
        setShowModalAgregar(true);
    };

    const handleCloseModalAgregar = () => {
        setShowModalAgregar(false);
        setStockParaAgregar(null);
        setCantidadAgregar(0);
        setLoadingAgregar(false);
    };

    const handleConfirmarAgregarStock = async () => {
        if (!stockParaAgregar || cantidadAgregar <= 0) {
            mostrarModalMensaje("Por favor ingrese una cantidad válida mayor a 0", "warning", "Advertencia");
            return;
        }
        setLoadingAgregar(true);
        try {
            // Crear el objeto SucursalInsumo con el stock actualizado
            const stockActualizado: SucursalInsumo = {
                ...stockParaAgregar.sucursalInsumo,
                stockActual: stockParaAgregar.stockActual + cantidadAgregar
            };

            // Llamar al servicio para agregar stock
            await SucursalInsumoService.agregarStock(stockActualizado);

            // Recargar los datos
            await cargarStockInsumos();

            // Cerrar modal
            handleCloseModalAgregar();

            // Mostrar mensaje de éxito (opcional)
            mostrarModalMensaje(`Stock agregado exitosamente. Nuevo stock: ${stockParaAgregar.stockActual + cantidadAgregar}`, "success", "Éxito");
        } catch (error) {
            console.error('Error al agregar stock:', error);
            mostrarModalMensaje('Error al agregar stock. Por favor intente nuevamente.', "danger", "Error");
        } finally {
            setLoadingAgregar(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroInsumo("");
        setFiltroSucursal("");
        setFiltroStockBajo(false);
        setFiltroStockAlto(false);
        setPage(0);
    };

    const getStockStatus = (stockActual: number, stockMinimo: number, stockMaximo: number) => {
        if (stockActual <= stockMinimo) {
            return { text: "Stock Bajo", className: "text-danger fw-bold", variant: "danger" };
        } else if (stockActual >= stockMaximo) {
            return { text: "Stock Alto", className: "text-warning fw-bold", variant: "warning" };
        } else {
            return { text: "Stock Normal", className: "text-success", variant: "success" };
        }
    };

    const columns = [
        {
            key: "imagen",
            label: "Imagen",
            render: (_: any, row: StockTableRow) => {
                const imagenUrl = row.sucursalInsumo.articuloInsumo?.imagenes?.[0]?.denominacion;
                return imagenUrl ? (
                    <img
                        src={imagenUrl}
                        alt="Imagen insumo"
                        style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "8px"
                        }}
                    />
                ) : (
                    "Sin imagen"
                );
            }
        },
        {
            key: "insumoNombre",
            label: "Insumo",
            render: (_: any, row: StockTableRow) => (
                <div>
                    <div className="fw-semibold">{row.insumoNombre}</div>
                    <small className="text-muted">
                        {row.sucursalInsumo.articuloInsumo?.categoria?.denominacion || "Sin categoría"}
                    </small>
                </div>
            )
        },
        {
            key: "sucursalNombre",
            label: "Sucursal",
            render: (_: any, row: StockTableRow) => (
                <span className="badge bg-light text-dark border">
                    {row.sucursalNombre}
                </span>
            )
        },
        {
            key: "stockActual",
            label: "Stock Actual",
            render: (_: any, row: StockTableRow) => {
                const status = getStockStatus(row.stockActual, row.stockMinimo, row.stockMaximo);
                return (
                    <div className="text-center">
                        <div className={`fs-5 fw-bold ${status.className}`}>
                            {row.stockActual.toFixed(2)}
                        </div>
                        <small className="text-muted">
                            {row.sucursalInsumo.articuloInsumo?.unidadMedida?.denominacion || "unidades"}
                        </small>
                    </div>
                );
            }
        },
        {
            key: "stockMinimo",
            label: "Stock Mínimo",
            render: (_: any, row: StockTableRow) => (
                <div className="text-center">
                    <span className="badge bg-danger-subtle text-danger">
                        {row.stockMinimo}
                    </span>
                </div>
            )
        },
        {
            key: "stockMaximo",
            label: "Stock Máximo",
            render: (_: any, row: StockTableRow) => (
                <div className="text-center">
                    <span className="badge bg-success-subtle text-success">
                        {row.stockMaximo}
                    </span>
                </div>
            )
        },
        {
            key: "estado",
            label: "Estado",
            render: (_: any, row: StockTableRow) => {
                const status = getStockStatus(row.stockActual, row.stockMinimo, row.stockMaximo);
                return (
                    <div className="text-center">
                        <span className={`badge bg-${status.variant}`}>
                            {status.text}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: StockTableRow) => (
                <div className="d-flex justify-content-center gap-1">
                    <BotonVer onClick={() => handleVer(row)} />
                    <Button
                        onClick={() => handleAgregarStock(row)}
                        variant=""
                        size="sm"
                        className="me-2 border-primary bg-white"
                    >
                        Agregar Stock
                    </Button>
                </div>
            )
        }
    ];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mb-0">Cargando información de stock...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-3" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <div className="mb-0">
                <Button variant="outline-danger" onClick={cargarStockInsumos}>
                    Reintentar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Control de Stock</h2>
                    <p className="text-muted mb-0">Gestión de inventario por sucursal</p>
                </div>
                <div className="d-flex gap-2">
                    <span className="badge bg-secondary fs-6">
                        Total: {filasFiltradas.length}
                    </span>
                    <span className="badge bg-danger fs-6">
                        Stock Bajo: {filasFiltradas.filter(f => f.stockActual <= f.stockMinimo).length}
                    </span>
                </div>
            </div>

            {/* Filtros */}
            <Card className="mb-4 shadow-sm">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="mb-0">Gestión de Stock</Card.Title>
                        <Button variant="success" size="sm" onClick={() => navigate('/FormularioStock')}>
                            ➕ Nuevo Stock
                        </Button>
                    </div>
                </Card.Header>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label">Buscar insumo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre del insumo..."
                                value={filtroInsumo}
                                onChange={e => setFiltroInsumo(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Sucursal</label>
                            <select
                                className="form-select"
                                value={filtroSucursal}
                                onChange={e => setFiltroSucursal(e.target.value)}
                            >
                                <option value="">Todas las sucursales</option>
                                {sucursales.map(sucursal => (
                                    <option key={sucursal.id} value={sucursal.id?.toString()}>
                                        {sucursal.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="stockBajo"
                                    checked={filtroStockBajo}
                                    onChange={e => setFiltroStockBajo(e.target.checked)}
                                />
                                <label className="form-check-label text-danger fw-bold" htmlFor="stockBajo">
                                    Stock Bajo
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="stockAlto"
                                    checked={filtroStockAlto}
                                    onChange={e => setFiltroStockAlto(e.target.checked)}
                                />
                                <label className="form-check-label text-warning fw-bold" htmlFor="stockAlto">
                                    Stock Alto
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="d-flex gap-2">
                                <Button variant="outline-secondary" onClick={limpiarFiltros} size="sm">
                                    Limpiar
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabla */}
            <div className="card">
                <div className="card-body p-0">
                    {filasFiltradas.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-box-seam display-1 text-muted"></i>
                            </div>
                            <h5 className="text-muted">No hay información de stock</h5>
                            <p className="text-muted mb-0">
                                {filtroInsumo || filtroSucursal || filtroStockBajo || filtroStockAlto
                                    ? "No se encontraron registros con los filtros aplicados"
                                    : "No hay información de stock para mostrar"
                                }
                            </p>
                            {(filtroInsumo || filtroSucursal || filtroStockBajo || filtroStockAlto) && (
                                <Button variant="outline-primary" onClick={limpiarFiltros} className="mt-2">
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Tabla */}
                            <div className="table-responsive">
                                <ReusableTable columns={columns} data={filasPaginadas} />
                            </div>

                            {/* Paginación */}
                            <div className="card-footer bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="px-2 small">
                                        Página {page + 1} de {totalPaginas || 1}
                                    </span>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        disabled={page >= totalPaginas - 1 || totalPaginas === 0}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        <ChevronRight />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal detalle */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Detalle de Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {stockSeleccionado && (
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="text-primary border-bottom pb-2">Información del Insumo</h5>
                                <div className="mb-3">
                                    <strong>Insumo:</strong>
                                    <div className="text-muted fs-5">{stockSeleccionado.insumoNombre}</div>
                                </div>
                                <div className="mb-3">
                                    <strong>Categoría:</strong>
                                    <div className="text-muted">
                                        {stockSeleccionado.sucursalInsumo.articuloInsumo?.categoria?.denominacion || "Sin categoría"}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Unidad de Medida:</strong>
                                    <div className="text-muted">
                                        {stockSeleccionado.sucursalInsumo.articuloInsumo?.unidadMedida?.denominacion || "Sin unidad"}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Sucursal:</strong>
                                    <div className="text-muted">{stockSeleccionado.sucursalNombre}</div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <h5 className="text-primary border-bottom pb-2">Control de Stock</h5>
                                <div className="mb-3">
                                    <strong>Stock Actual:</strong>
                                    <div className="fs-3 fw-bold text-primary">{stockSeleccionado.stockActual.toFixed(2)}</div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <strong>Stock Mínimo:</strong>
                                        <div className="badge bg-danger fs-6">{stockSeleccionado.stockMinimo}</div>
                                    </div>
                                    <div className="col-6">
                                        <strong>Stock Máximo:</strong>
                                        <div className="badge bg-success fs-6">{stockSeleccionado.stockMaximo}</div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Estado del Stock:</strong>
                                    <div className="mt-1">
                                        {(() => {
                                            const status = getStockStatus(
                                                stockSeleccionado.stockActual,
                                                stockSeleccionado.stockMinimo,
                                                stockSeleccionado.stockMaximo
                                            );
                                            return (
                                                <span className={`badge bg-${status.variant} fs-6`}>
                                                    {status.text}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Indicador visual de stock */}
                                <div className="mb-3">
                                    <strong>Nivel de Stock:</strong>
                                    <div className="progress mt-2" style={{ height: '20px' }}>
                                        <div
                                            className={`progress-bar ${stockSeleccionado.stockActual <= stockSeleccionado.stockMinimo ? 'bg-danger' :
                                                stockSeleccionado.stockActual >= stockSeleccionado.stockMaximo ? 'bg-warning' : 'bg-success'
                                                }`}
                                            role="progressbar"
                                            style={{
                                                width: `${Math.min(100, (stockSeleccionado.stockActual / stockSeleccionado.stockMaximo) * 100)}%`
                                            }}
                                        >
                                            {stockSeleccionado.stockActual.toFixed(2)}/{stockSeleccionado.stockMaximo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    {stockSeleccionado && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                handleActualizarStock(stockSeleccionado);
                                handleCloseModal();
                            }}
                        >
                            Actualizar Stock
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Modal Agregar Stock */}
            <Modal show={showModalAgregar} onHide={handleCloseModalAgregar} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>Agregar Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {stockParaAgregar && (
                        <div>
                            <div className="mb-4">
                                <h6 className="text-success border-bottom pb-2">Información del Insumo</h6>
                                <div className="row">
                                    <div className="col-8">
                                        <strong>Insumo:</strong>
                                        <div className="text-muted">{stockParaAgregar.insumoNombre}</div>
                                    </div>
                                    <div className="col-4">
                                        <strong>Sucursal:</strong>
                                        <div className="text-muted">{stockParaAgregar.sucursalNombre}</div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <strong>Stock Actual:</strong>
                                    <span className="ms-2 badge bg-primary fs-6">
                                        {stockParaAgregar.stockActual.toFixed(2)} {stockParaAgregar.sucursalInsumo.articuloInsumo?.unidadMedida?.denominacion || "unidades"}
                                    </span>
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cantidad a agregar *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={cantidadAgregar}
                                        onChange={e => setCantidadAgregar(Number(e.target.value))}
                                        placeholder="Ingrese la cantidad a agregar"
                                        disabled={loadingAgregar}
                                    />
                                    <Form.Text className="text-muted">
                                        La cantidad debe ser mayor a 0
                                    </Form.Text>
                                </Form.Group>

                                {cantidadAgregar > 0 && (
                                    <div className="alert alert-info">
                                        <strong>Resumen de la operación:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Stock anterior: <strong>{stockParaAgregar.stockActual.toFixed(2)}</strong></li>
                                            <li>Cantidad a agregar: <strong>{cantidadAgregar}</strong></li>
                                            <li>Stock resultante: <strong>{stockParaAgregar.stockActual.toFixed(2) + cantidadAgregar}</strong></li>
                                        </ul>
                                    </div>
                                )}
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalAgregar} disabled={loadingAgregar}>
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleConfirmarAgregarStock}
                        disabled={loadingAgregar || cantidadAgregar <= 0}
                    >
                        {loadingAgregar ? (
                            <>
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                Agregando...
                            </>
                        ) : (
                            'Confirmar Agregar Stock'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ModalMensaje
                show={modalMensaje.show}
                onHide={() => setModalMensaje({ ...modalMensaje, show: false })}
                mensaje={modalMensaje.mensaje}
                titulo={modalMensaje.titulo}
                variante={modalMensaje.variante}
            />
        </div >
    );
}

export default GrillaStock;