import { useState, useEffect } from "react";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";

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

  const eliminarCategoria = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar esta categoría?")) return;
    try {
      await CategoriaService.delete(id);
      setCategorias(prev => prev.filter(a => a.id !== id));
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
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: Categoria) => (
        <div>
          <Button
            variant="info"
            size="sm"
            className="me-2"
            onClick={() => handleVer(row)}
          >
            Ver
          </Button>
          <Button
            variant="warning"
            size="sm"
            className="me-2"
            onClick={() => handleActualizar(row)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => eliminarCategoria(row.id!)}
          >
            Eliminar
          </Button>
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