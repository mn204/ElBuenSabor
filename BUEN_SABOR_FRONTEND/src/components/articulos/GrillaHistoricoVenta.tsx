import { useState, useEffect } from "react";
import HistoricoVentaService from "../../services/HistoricoVentaService";
import HistoricoVenta from "../../models/HistoricoPrecioVenta";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";

function GrillaHistoricoVenta() {
  const [historicos, setHistoricos] = useState<HistoricoVenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [historicoSeleccionado, setHistoricoSeleccionado] = useState<HistoricoVenta | null>(null);

  useEffect(() => {
    cargarHistoricos();
  }, []);

  const cargarHistoricos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await HistoricoVentaService.getAll();
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
      await HistoricoVentaService.delete(id);
      setHistoricos(prev => prev.filter(a => a.id !== id));
      alert("Histórico eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el histórico");
    }
  };

  const handleActualizar = (his: HistoricoVenta) => {
    window.location.href = `/historicoventa?id=${his.id}`;
  };

  const handleVer = (his: HistoricoVenta) => {
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
      render: (_: any, row: HistoricoVenta) => (
        <div className="d-flex justify-content-center">
          <BotonVer 
            onClick={() => handleVer(row)}
          />
          <BotonModificar
            onClick={() => handleActualizar(row)}
          />
          {!row.eliminado ? (  
            <BotonEliminar
              onClick={() => eliminarHistorico(row.id!)}
            />
          ) : (
            <BotonAlta/>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando históricos de venta...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Histórico de Venta</h2>
      <ReusableTable columns={columns} data={historicos} />
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Histórico de Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {historicoSeleccionado && (
            <div>
              <p><b>Fecha:</b> {historicoSeleccionado.fecha instanceof Date ? historicoSeleccionado.fecha.toLocaleDateString() : historicoSeleccionado.fecha}</p>
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

export default GrillaHistoricoVenta;