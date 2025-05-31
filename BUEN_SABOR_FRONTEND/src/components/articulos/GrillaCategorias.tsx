import { useState, useEffect } from "react";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";

function GrillaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal de "Ver"
  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      setError("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const darDeAlta = async (id: number) => {
    if (!window.confirm("¿Seguro que desea dar de alta esta categoría?")) return;
    try {
      await CategoriaService.changeEliminado(id);
      cargarCategorias();
      alert("Categoría dada de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta la categoría");
    }
  }

  const eliminarCategoria = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar esta categoría?")) return;
    try {
      await CategoriaService.delete(id);
      cargarCategorias();
      alert("Categoría eliminada correctamente");
    } catch (err) {
      alert("Error al eliminar la categoría");
    }
  };

  const handleActualizar = (cat: Categoria) => {
    window.location.href = `/categoria?id=${cat.id}`;
  };

  const handleVer = (cat: Categoria) => {
    setCategoriaSeleccionada(cat);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaSeleccionada(null);
  };

  // Definición de columnas para la tabla reusable
  const columns = [
    { key: "denominacion", label: "Denominación" },
    {
      key: "categoriaPadre",
      label: "Categoría Padre",
      render: (_: any, row: Categoria) => row.categoriaPadre?.denominacion || "-",
    },
    {
      key: "eliminado",
      label: "Estado",
      render: (value: boolean) => (value ? "Eliminado" : "Activo"),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: Categoria) => (
        <div className="d-flex justify-content-center">
          <BotonVer 
            onClick={() => handleVer(row)}
          />
          <BotonModificar
            onClick={() => handleActualizar(row)}
          />
          {!row.eliminado ? (  
            <BotonEliminar
              onClick={() => eliminarCategoria(row.id!)}
            />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id!)}/>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Categorías</h2>
      <ReusableTable columns={columns} data={categorias} />
      {/* Modal para ver información */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de la Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoriaSeleccionada && (
            <div>
              <p><b>Denominación:</b> {categoriaSeleccionada.denominacion}</p>
              <p><b>Categoría Padre:</b> {categoriaSeleccionada.categoriaPadre?.denominacion || "-"}</p>
              <p><b>Estado</b> {categoriaSeleccionada.eliminado ? "Eliminado" : "Activo"}</p>
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

export default GrillaCategorias;