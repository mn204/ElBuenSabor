import { useState, useEffect } from "react";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import { obtenerSucursales } from "../../services/SucursalService";
import type ArticuloInsumo from "../../models/ArticuloInsumo";
import type Sucursal from "../../models/Sucursal";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonModificar from "../layout/BotonModificar";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function GrillaStock() {
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    // Modal Ver
    const [showModal, setShowModal] = useState(false);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState<ArticuloInsumo | null>(null);

    // Filtros
    const [filtroDenominacion, setFiltroDenominacion] = useState("");
    const [filtroSucursal, setFiltroSucursal] = useState("");
    const [filtroStockBajo, setFiltroStockBajo] = useState(false);
    const [filtroStockAlto, setFiltroStockAlto] = useState(false);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const cargarSucursales = async () => {
        try {
            const sucursalesData = await obtenerSucursales();
            setSucursales(sucursalesData);
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };
    useEffect(() => {
        cargarInsumos();
        cargarSucursales();
    }, []);

    // Resetear página cuando cambien los filtros
    useEffect(() => {
        setPage(0);
    }, [filtroDenominacion, filtroSucursal, filtroStockBajo, filtroStockAlto]);

    const cargarInsumos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ArticuloInsumoService.getAll();
            // Filtrar solo los insumos que tienen información de stock (sucursalInsumo)
            const insumosConStock = data.filter(insumo => insumo.sucursalInsumo && !insumo.eliminado);
            setInsumos(insumosConStock);
        } catch (err) {
            setError("Error al cargar la información de stock");
        } finally {
            setLoading(false);
        }
    };

    // Filtro local
    const insumosFiltrados = insumos.filter(insumo => {
        const sucursalInsumo = insumo.sucursalInsumo!;

        return (
            (!filtroDenominacion || insumo.denominacion.toLowerCase().includes(filtroDenominacion.toLowerCase())) &&
            (!filtroSucursal || String(sucursalInsumo.sucursal?.id) === filtroSucursal) &&
            (!filtroStockBajo || sucursalInsumo.stockActual <= sucursalInsumo.stockMinimo) &&
            (!filtroStockAlto || sucursalInsumo.stockActual >= sucursalInsumo.stockMaximo)
        );
    });

    // Calcular páginas totales basado en los elementos filtrados
    const totalPages = Math.ceil(insumosFiltrados.length / size);

    // Aplicar paginación a los elementos filtrados
    const insumosPaginados = insumosFiltrados.slice(page * size, (page + 1) * size);

    const handleVer = (insumo: ArticuloInsumo) => {
        setInsumoSeleccionado(insumo);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setInsumoSeleccionado(null);
    };

    const handleActualizarStock = (insumo: ArticuloInsumo) => {
        // Aquí puedes redirigir a un formulario para actualizar el stock
        window.location.href = `/FormularioStock?id=${insumo.id}`;
    };

    const limpiarFiltros = () => {
        setFiltroDenominacion("");
        setFiltroSucursal("");
        setFiltroStockBajo(false);
        setFiltroStockAlto(false);
    };

    const getStockStatus = (stockActual: number, stockMinimo: number, stockMaximo: number) => {
        if (stockActual <= stockMinimo) {
            return { text: "Stock Bajo", className: "text-danger fw-bold" };
        } else if (stockActual >= stockMaximo) {
            return { text: "Stock Alto", className: "text-warning fw-bold" };
        } else {
            return { text: "Stock Normal", className: "text-success" };
        }
    };

    const columns = [
        { key: "denominacion", label: "Insumo" },
        {
            key: "categoria",
            label: "Categoría",
            render: (_: any, row: ArticuloInsumo) => row.categoria?.denominacion || "-",
        },
        {
            key: "sucursal",
            label: "Sucursal",
            render: (_: any, row: ArticuloInsumo) => row.sucursalInsumo?.sucursal?.nombre || "-",
        },
        {
            key: "stockActual",
            label: "Stock Actual",
            render: (_: any, row: ArticuloInsumo) => row.sucursalInsumo?.stockActual || 0,
        },
        {
            key: "stockMinimo",
            label: "Stock Mínimo",
            render: (_: any, row: ArticuloInsumo) => row.sucursalInsumo?.stockMinimo || 0,
        },
        {
            key: "stockMaximo",
            label: "Stock Máximo",
            render: (_: any, row: ArticuloInsumo) => row.sucursalInsumo?.stockMaximo || 0,
        },
        {
            key: "estado",
            label: "Estado",
            render: (_: any, row: ArticuloInsumo) => {
                const sucursalInsumo = row.sucursalInsumo!;
                const status = getStockStatus(
                    sucursalInsumo.stockActual,
                    sucursalInsumo.stockMinimo,
                    sucursalInsumo.stockMaximo
                );
                return <span className={status.className}>{status.text}</span>;
            },
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: ArticuloInsumo) => (
                <div className="d-flex justify-content-center">
                    <BotonVer onClick={() => handleVer(row)} />
                    <BotonModificar onClick={() => handleActualizarStock(row)} />
                </div>
            ),
        },
    ];

    if (loading) return <div>Cargando información de stock...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="position-relative">
            <h2>Control de Stock</h2>
            <div className="filtrosybtn d-flex justify-content-between align-items-center">
                <div className="m-4 d-flex flex-wrap gap-2 align-items-end">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por insumo"
                        value={filtroDenominacion}
                        onChange={e => setFiltroDenominacion(e.target.value)}
                        style={{ maxWidth: 180 }}
                    />
                    <select
                        className="form-select"
                        value={filtroSucursal}
                        onChange={e => setFiltroSucursal(e.target.value)}
                        style={{ maxWidth: 180 }}
                    >
                        <option value="">Todas las sucursales</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id?.toString()}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="stockBajo"
                            checked={filtroStockBajo}
                            onChange={e => setFiltroStockBajo(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="stockBajo">
                            Stock Bajo
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="stockAlto"
                            checked={filtroStockAlto}
                            onChange={e => setFiltroStockAlto(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="stockAlto">
                            Stock Alto
                        </label>
                    </div>
                    <Button variant="secondary" onClick={limpiarFiltros}>
                        Limpiar filtros
                    </Button>
                </div>
                <Link className="btn border-success" to='/FormularioStock'>Crear Stock</Link>
            </div>

            {/* Tabla */}
            <div className="p-3 border rounded bg-white shadow-sm">
                {insumosFiltrados.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted mb-0">
                            No hay información de stock para mostrar
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Tabla */}
                        <div className="table-responsive">
                            <ReusableTable columns={columns} data={insumosPaginados} />
                        </div>

                        {/* Paginación */}
                        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                            <div className="text-muted">
                                Mostrando {page * size + 1}-{Math.min((page + 1) * size, insumosFiltrados.length)} de {insumosFiltrados.length} registros
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
                                    disabled={page >= totalPages - 1 || totalPages === 0}
                                    onClick={() => setPage(page + 1)}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal detalle */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle de Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {insumoSeleccionado && insumoSeleccionado.sucursalInsumo && (
                        <div>
                            <h5>Información del Insumo</h5>
                            <p><b>Denominación:</b> {insumoSeleccionado.denominacion}</p>
                            <p><b>Categoría:</b> {insumoSeleccionado.categoria?.denominacion || "-"}</p>
                            <p><b>Unidad de Medida:</b> {insumoSeleccionado.unidadMedida?.denominacion || "-"}</p>
                            <p><b>Precio Compra:</b> ${insumoSeleccionado.precioCompra}</p>
                            <p><b>Precio Venta:</b> ${insumoSeleccionado.precioVenta}</p>

                            <hr />

                            <h5>Información de Stock</h5>
                            <p><b>Sucursal:</b> {insumoSeleccionado.sucursalInsumo.sucursal?.nombre || "-"}</p>
                            <p><b>Stock Actual:</b> {insumoSeleccionado.sucursalInsumo.stockActual}</p>
                            <p><b>Stock Mínimo:</b> {insumoSeleccionado.sucursalInsumo.stockMinimo}</p>
                            <p><b>Stock Máximo:</b> {insumoSeleccionado.sucursalInsumo.stockMaximo}</p>

                            <div className="mt-3">
                                <b>Estado: </b>
                                {(() => {
                                    const status = getStockStatus(
                                        insumoSeleccionado.sucursalInsumo.stockActual,
                                        insumoSeleccionado.sucursalInsumo.stockMinimo,
                                        insumoSeleccionado.sucursalInsumo.stockMaximo
                                    );
                                    return <span className={status.className}>{status.text}</span>;
                                })()}
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
}

export default GrillaStock;