import { useState, useEffect } from "react";
import HistoricoCompraService from "../../services/HistoricoCompraService";
import HistoricoCompra from "../../models/HistoricoCompra";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";

function GrillaHistoricoCompra() {
  const [historicos, setHistoricos] = useState<HistoricoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [historicoSeleccionado, setHistoricoSeleccionado] = useState<HistoricoCompra | null>(null);

  useEffect(() => {
    cargarHistoricos();
  }, []);

  const cargarHistoricos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await HistoricoCompraService.getAll();
      setHistoricos(data);
    } catch (err) {
      setError("Error al cargar los históricos");
    } finally {
      setLoading(false);
    }
  };

  const eliminarHistorico = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar este histórico?")) return;
    try {
      await HistoricoCompraService.delete(id);
      setHistoricos(prev => prev.filter(a => a.id !== id));
      alert("Histórico eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el histórico");
    }
  };

  const handleActualizar = (his: HistoricoCompra) => {
    window.location.href = `/historicocompra?id=${his.id}`;
  };

  const handleVer = (his: HistoricoCompra) => {
    setHistoricoSeleccionado(his);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setHistoricoSeleccionado(null);
  };

  const columns = [
    { key: "fecha", label: "Fecha" },
    { key: "precio", label: "Precio", render: (value: number) => `$${value}` },
    {
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: HistoricoCompra) => (
        <div>
          <Button variant="info" size="sm" className="me-2" onClick={() => handleVer(row)}>Ver</Button>
          <Button variant="warning" size="sm" className="me-2" onClick={() => handleActualizar(row)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => eliminarHistorico(row.id!)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando históricos de compra...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Histórico de Compra</h2>
      <ReusableTable columns={columns} data={historicos} />
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Histórico de Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {historicoSeleccionado && (
            <div>
              <p><b>Fecha:</b> {historicoSeleccionado.fecha}</p>
              <p><b>Precio:</b> ${historicoSeleccionado.precio}</p>
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

export default GrillaHistoricoCompra;