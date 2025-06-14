import { Modal, Button, Table } from 'react-bootstrap';
import { Pedido } from '../../../models/Pedido'; // Ajustá la ruta si es diferente
import { Eye } from 'react-bootstrap-icons';
import articuloManufacturadoService from '../../../services/ArticuloManufacturadoService'; // Asegurate que esta ruta esté bien
import {useState, useEffect} from "react";
//TODO: hacer mas bonitos los detalles de los productos
interface Props {
    show: boolean;
    onHide: () => void;
    pedido: Pedido | null;
    onMarcarListo: (pedidoId: number) => void;
}
const CocinaModal = ({ show, onHide, pedido, onMarcarListo }: Props) => {
    if (!pedido) return null;
    const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);
    const [showArticuloModal, setShowArticuloModal] = useState(false);
    const [articulosManufacturadosIds, setArticulosManufacturadosIds] = useState<Set<number>>(new Set());

    const horaPedido = new Date(pedido.fechaPedido).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const calcularHoraEstimada = (): string => {
        if (!pedido?.horaEstimadaFinalizacion) return "No especificada";

        const fecha = new Date(`1970-01-01T${pedido.horaEstimadaFinalizacion}`);

        if (pedido.tipoEnvio === "DELIVERY") {
            fecha.setMinutes(fecha.getMinutes() - 10);
        }

        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${horas}:${minutos}`;
    };

    const handleVerDetalleArticulo = async (idArticulo: number) => {
        try {
            const articulo = await articuloManufacturadoService.getById(idArticulo);
            setArticuloSeleccionado(articulo);
            setShowArticuloModal(true);
        } catch (error) {
            // Si el artículo no es manufacturado, no hacemos nada
            console.log("Este artículo no es un manufacturado");
        }
    };

    const handleCloseModalArticulo = () => {
        setShowArticuloModal(false);
        setArticuloSeleccionado(null);
    };

    useEffect(() => {
        const fetchArticulosManufacturados = async () => {
            if (!pedido) return;

            const ids = await Promise.all(
                pedido.detalles.map(async (detalle) => {
                    try {
                        await articuloManufacturadoService.getById(detalle.articulo.id);
                        return detalle.articulo.id;
                    } catch {
                        return null;
                    }
                })
            );

            // Solo agregamos los que sí existen
            setArticulosManufacturadosIds(new Set(ids.filter((id): id is number => id !== null)));
        };

        fetchArticulosManufacturados();
    }, [pedido]);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <span className="fw-bold">Pedido Nº #{pedido.id}</span>
                    <span className="text-muted">Hora Pedido: {horaPedido} </span>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <div><strong>Hora estimada de finalización:</strong> {calcularHoraEstimada()}</div>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={async () => {
                            if (pedido) {
                                await onMarcarListo(pedido.id); // ✅ llamada async directa
                            }
                        }}
                    >
                        Pasar a Listo
                    </Button>

                </div>

                <h5 className="mb-2">Productos</h5>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Denominación</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pedido.detalles.map((detalle) => (
                        <tr key={detalle.id}>
                            <td>{detalle.cantidad}</td>
                            <td>{detalle.articulo.denominacion}</td>
                            <td>
                                {articulosManufacturadosIds.has(detalle.articulo.id) && (
                                    <Button
                                        variant="info"
                                        size="sm"
                                        title="Ver detalle"
                                        onClick={() => handleVerDetalleArticulo(detalle.articulo.id)}
                                    >
                                        <Eye /> Ver detalle
                                    </Button>
                                )}
                            </td>

                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Modal.Body>
            <Modal show={showArticuloModal} onHide={handleCloseModalArticulo} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Artículo Manufacturado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {articuloSeleccionado ? (
                        <div>
                            {articuloSeleccionado.imagenes[0] ? (
                                <img
                                    src={articuloSeleccionado.imagenes[0].denominacion}
                                    className="imgModalArtManu"
                                    alt=""
                                />
                            ) : null}
                            <p><b>Denominación:</b> {articuloSeleccionado.denominacion}</p>
                            <p><b>Descripción:</b> {articuloSeleccionado.descripcion}</p>
                            <p><b>Precio Venta:</b> ${articuloSeleccionado.precioVenta}</p>
                            <p><b>Categoría:</b> {articuloSeleccionado.categoria?.denominacion}</p>
                            <p><b>Unidad de Medida:</b> {articuloSeleccionado.unidadMedida?.denominacion}</p>
                            <p><b>Tiempo Estimado:</b> {articuloSeleccionado.tiempoEstimadoMinutos} min</p>
                            <p><b>Preparación:</b> {articuloSeleccionado.preparacion}</p>
                            <p><b>Estado:</b> {articuloSeleccionado.eliminado ? "Eliminado" : "Activo"}</p>
                            <b>Detalles:</b>
                            <ul>
                                {articuloSeleccionado.detalles?.map((det, idx) => (
                                    <li key={idx}>
                                        {det.articuloInsumo?.denominacion} - {det.cantidad} {det.articuloInsumo?.unidadMedida?.denominacion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-muted">No se pudo cargar el artículo.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalArticulo}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </Modal>


    );
};

export default CocinaModal;
