import { useState, useEffect } from "react";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla"; // Importa el componente
import "../../styles/GrillaArticuloManufactura.css"; // Asegúrate de tener este archivo CSS
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonVer from "../layout/BotonVer";
import BotonAlta from "../layout/BotonAlta";
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
      setArticulos(prev =>
        prev.map(a =>
          a.id === id ? { ...a, eliminado: true } : a
        )
      );
      alert("Artículo manufacturado eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el artículo manufacturado");
    }
  };

  const handleActualizar = (art: ArticuloManufacturado) => {
    window.location.href = `/manufacturado?id=${art.id}`;
  };

  const handleVer = (art: ArticuloManufacturado) => {
    setArticuloSeleccionado(art);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
  };

  const darDeAlta = async (id: number) => {
      if (!window.confirm("¿Seguro que desea dar de alta esta categoría?")) return;
      try {
        await ArticuloManufacturadoService.changeEliminado(id);
        setArticulos(prev =>
          prev.map(a =>
            a.id === id ? { ...a, eliminado: false } : a
          )
        );
        alert("Categoría dada de alta correctamente");
      } catch (err) {
        alert("Error al dar de alta la categoría");
      }
    }

  // Definición de columnas para la tabla reusable
  const columns = [
    { key: "denominacion", label: "Denominación" },
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
      className: "acciones-column d-flex justify-content-center gap-1",
      render: (_: any, row: ArticuloManufacturado) => (
        <div>
          <BotonVer 
            onClick={() => handleVer(row)}
          />
          <BotonModificar
            onClick={() => handleActualizar(row)}
          />
          {!row.eliminado ? (  
            <BotonEliminar
              onClick={() => eliminarArticulo(row.id!)}
            />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id!)}/>
          )}
        </div>
      ),
    },
  ];  
  console.log(articuloSeleccionado);
  if (loading) return <div>Cargando artículos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Artículos Manufacturado</h2>
      <Button variant="primary" className="crearManufacturadoBtn mb-3" onClick={() => window.location.href = "/manufacturado"}>
        Crear Artículo Manufacturado
      </Button>
      <ReusableTable columns={columns} data={articulos} />
      {/* Modal para ver información */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Artículo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articuloSeleccionado && (
            <div>
              <img src={articuloSeleccionado.imagenesArticuloManufacturado[0].denominacion} className="imgModalArtManu" alt="" />
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