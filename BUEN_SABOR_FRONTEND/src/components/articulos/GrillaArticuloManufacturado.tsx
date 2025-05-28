import { useState, useEffect } from "react";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function GrillaArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal de "Ver"
  const [showModal, setShowModal] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ArticuloManufacturadoService.getAll();
      setArticulos(data);
    } catch (err) {
      setError("Error al cargar los artículos manufacturados");
    } finally {
      setLoading(false);
    }
  };

  const eliminarArticulo = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar este artículo manufacturado?")) return;
    try {
      await ArticuloManufacturadoService.delete(id);
      setArticulos(prev => prev.filter(a => a.id !== id));
      alert("Artículo manufacturado eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el artículo manufacturado");
    }
  };

  const handleActualizar = (art: ArticuloManufacturado) => {
    window.location.href = `/manu?id=${art.id}`;
  };

  // Nuevo: handleVer para abrir el modal
  const handleVer = (art: ArticuloManufacturado) => {
    setArticuloSeleccionado(art);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
  };

  if (loading) return <div>Cargando artículos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Artículos Manufacturado</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Denominación</th>
            <th>Precio Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map(art => (
            <tr key={art.id}>
              <td>{art.denominacion}</td>
              <td>${art.precioVenta}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleVer(art)}
                >
                  Ver
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleActualizar(art)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarArticulo(art.id!)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver información */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Artículo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articuloSeleccionado && (
            <div>
              <p><b>Denominación:</b> {articuloSeleccionado.denominacion}</p>
              <p><b>Descripción:</b> {articuloSeleccionado.descripcion}</p>
              <p><b>Precio Venta:</b> ${articuloSeleccionado.precioVenta}</p>
              <p><b>Categoría:</b> {articuloSeleccionado.categoria?.denominacion}</p>
              <p><b>Unidad de Medida:</b> {articuloSeleccionado.unidadMedida?.denominacion}</p>
              <p><b>Tiempo Estimado:</b> {articuloSeleccionado.tiempoEstimadoMinutos} min</p>
              <p><b>Preparación:</b> {articuloSeleccionado.preparacion}</p>
              <b>Detalles:</b>
              <ul>
                {articuloSeleccionado.detalles?.map((det, idx) => (
                  <li key={idx}>
                    {det.articuloInsumo?.denominacion} - {det.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GrillaArticuloManufacturado;