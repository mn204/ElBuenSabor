import { useState, useEffect } from "react";
import InsumoService from "../../services/ArticuloInsumoService";
import Insumo from "../../models/ArticuloInsumo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";

function GrillaInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal de "Ver"
  const [showModal, setShowModal] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);

  useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await InsumoService.getAll();
      setInsumos(data);
    } catch (err) {
      setError("Error al cargar los insumos");
    } finally {
      setLoading(false);
    }
  };

  const eliminarInsumo = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar este insumo?")) return;
    try {
      await InsumoService.delete(id);
      setInsumos(prev =>
          prev.map(a =>
            a.id === id ? { ...a, eliminado: true } : a
          )
        );
      alert("Insumo eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el insumo");
    }
  };

  const handleActualizar = (ins: Insumo) => {
    window.location.href = `/articulo?id=${ins.id}`;
  };

  const handleVer = (ins: Insumo) => {
    setInsumoSeleccionado(ins);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInsumoSeleccionado(null);
  };

  const darDeAlta = async (id: number) => {
      if (!window.confirm("¿Seguro que desea dar de alta esta categoría?")) return;
      try {
        await InsumoService.changeEliminado(id);
        setInsumos(prev =>
          prev.map(a =>
            a.id === id ? { ...a, eliminado: false } : a
          )
        );
        alert("Insumo dada de alta correctamente");
      } catch (err) {
        alert("Error al dar de alta el Insumo");
      }
    }

  // Definición de columnas para la tabla reusable
  const columns = [
    { key: "denominacion", label: "Denominación" },
    {
        key: "categoria",
        label: "Categoría",
        render: (_: any, row: Insumo) => row.categoria?.denominacion || "-",
    },
    {
      key: "unidadMedida",
      label: "Unidad de Medida",
      render: (_: any, row: Insumo) => row.unidadMedida?.denominacion || "-",
    },
    {
      key: "precioVenta",
      label: "Precio Venta",
      render: (value: number) => `$${value}`,
    },
    {
      key: "eliminado",
      label: "Estado",
      render: (value: boolean) => (value ? "Eliminado" : "Activo"),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: Insumo) => (
        <div className="d-flex justify-content-center">
          <BotonVer 
            onClick={() => handleVer(row)}
          />
          <BotonModificar
            onClick={() => handleActualizar(row)}
          />
          {!row.eliminado ? (  
            <BotonEliminar
              onClick={() => eliminarInsumo(row.id!)}
            />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id!)}/>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando insumos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Insumos</h2>
      <ReusableTable columns={columns} data={insumos} />
      {/* Modal para ver información */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Insumo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {insumoSeleccionado && (
            <div>
              <p><b>Denominación:</b> {insumoSeleccionado.denominacion}</p>
              <p><b>Categoria</b> {insumoSeleccionado.categoria.denominacion}</p>
              <p><b>Unidad de Medida:</b> {insumoSeleccionado.unidadMedida?.denominacion || "-"}</p>
              <p><b>Precio Venta:</b> ${insumoSeleccionado.precioVenta}</p>
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

export default GrillaInsumos;