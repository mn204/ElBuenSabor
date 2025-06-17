import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Promocion from "../../models/Promocion";
import PromocionService from "../../services/PromocionService";
import { ReusableTable } from "../Tabla";
import BotonAlta from "../layout/BotonAlta";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonVer from "../layout/BotonVer";
import { Modal, Table } from "react-bootstrap";

export function GrillaPromocion() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);

    useEffect(() => {
        cargarPromociones();
    }, []);

    const cargarPromociones = async () => {
        try {
            const data = await PromocionService.getAll();
            setPromociones(data);
        } catch (error) {
            console.error("Error cargando promociones:", error);
        }
    };

    const columns = [
        { key: "denominacion", label: "Denominación" },
        {
            key: "fechaDesde",
            label: "Desde",
            render: (_: any, row: Promocion) =>
                new Date(row.fechaDesde).toLocaleDateString(),
        },
        {
            key: "fechaHasta",
            label: "Hasta",
            render: (_: any, row: Promocion) =>
                new Date(row.fechaHasta).toLocaleDateString(),
        },
        {
            key: "tipoPromocion",
            label: "Tipo",
            render: (value: string) =>
                value === "HAPPYHOUR" ? "Happy Hour" : "Promoción",
        },
        {
            key: "precioPromocional",
            label: "Precio Promocional",
            render: (value: number) => `$${value.toFixed(2)}`,
        },
        {
            key: "activa",
            label: "Estado",
            render: (value: boolean) => (value ? "Activa" : "Inactiva"),
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: Promocion) => (
                <div className="d-flex justify-content-center">
                    <BotonVer onClick={() => handleVer(row)} />
                    <BotonModificar onClick={() => handleActualizar(row)} />
                    {!row.eliminado ? (
                        <BotonEliminar onClick={() => eliminarPromocion(row.id!)} />
                    ) : (
                        <BotonAlta onClick={() => darDeAlta(row.id!)} />
                    )}
                </div>
            ),
        },
    ];
    const darDeAlta = async (id: number) => {
        if (!window.confirm("¿Seguro que desea dar de alta esta categoría?")) return;
        try {
            await PromocionService.changeEliminado(id);
            cargarPromociones();
            alert("Categoría dada de alta correctamente");
        } catch (err) {
            alert("Error al dar de alta la categoría");
        }
    }

    const eliminarPromocion = async (id: number) => {
        if (!window.confirm("¿Seguro que desea eliminar esta categoría?")) return;
        try {
            await PromocionService.delete(id);
            cargarPromociones();
            alert("Categoría eliminada correctamente");
        } catch (err) {
            alert("Error al eliminar la categoría");
        }
    };

    const handleActualizar = (prom: Promocion) => {
        window.location.href = `/FormularioPromocion?id=${prom.id}`;
    };
    const [showModal, setShowModal] = useState(false);
    const [promocionSeleccionada, setPromocioneSeleccionada] = useState<Promocion | null>(null);

    const handleVer = (prom: Promocion) => {
        setPromocioneSeleccionada(prom);
        setShowModal(true);
    };

    const renderRow = (promo: Promocion) => (
        <tr key={promo.id}>
            <td>{promo.denominacion}</td>
            <td>{new Date(promo.fechaDesde).toLocaleDateString()}</td>
            <td>{new Date(promo.fechaHasta).toLocaleDateString()}</td>
            <td>{promo.tipoPromocion}</td>
            <td>${promo.precioPromocional.toFixed(2)}</td>
            <td>{promo.activa ? "Activa" : "Inactiva"}</td>
            <td className="d-flex gap-2">
                <Link to={`/FormularioPromocion?id=${promo.id}`} className="btn btn-warning btn-sm">
                    Modificar
                </Link>
                <Button variant="danger" size="sm" onClick={() => eliminarPromocion(promo.id!)}>
                    Eliminar
                </Button>
            </td>
        </tr>
    );
    const handleCloseModal = () => {
        setShowModal(false);
        setPromocioneSeleccionada(null);
    };
    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Promociones</h2>
                <Link className="btn border-success" to="/FormularioPromocion">
                    Crear Promoción
                </Link>
            </div>

            <ReusableTable
                data={promociones}
                columns={columns}
            />
            {/* Modal detalle */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle de Promocion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {promocionSeleccionada && (
                        <div>
                            <img src={promocionSeleccionada.imagenes[0]?.denominacion} alt="" />
                            <p><b>Denominación:</b> {promocionSeleccionada.denominacion}</p>
                            <p><b>Descripcion:</b> {promocionSeleccionada.descripcionDescuento}</p>
                            <p><b>Fecha Desde:</b> {promocionSeleccionada.fechaDesde.toString() || "-"}</p>
                            <p><b>Fecha Hasta:</b> {promocionSeleccionada.fechaHasta.toString() || "-"}</p>
                            <p><b>Hora Desde:</b> {promocionSeleccionada.horaDesde}</p>
                            <p><b>Hora Hasta:</b> {promocionSeleccionada.horaHasta}</p>
                            <p><b>Tipo:</b> ${promocionSeleccionada.tipoPromocion}</p>
                            {promocionSeleccionada.detalles && (
                                <Table striped bordered>
                                    <thead>
                                        <tr>
                                            <th>Artículo</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promocionSeleccionada.detalles.map((d, idx) => (
                                            <tr key={idx}>
                                                <td>{d.articulo.denominacion}</td>
                                                <td>{d.cantidad}</td>
                                                <td>${d.articulo.precioVenta?.toFixed(2) ?? ""}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: "center", fontWeight: "bold" }}>
                                                Precio promocional: ${promocionSeleccionada.precioPromocional.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            )}
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
