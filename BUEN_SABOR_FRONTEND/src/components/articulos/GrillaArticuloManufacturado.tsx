import { useState, useEffect } from "react";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import "../../styles/GrillaArticuloManufactura.css";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonVer from "../layout/BotonVer";
import BotonAlta from "../layout/BotonAlta";

function GrillaArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroDenominacion, setFiltroDenominacion] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(""); // "", "activo", "eliminado"
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);

  useEffect(() => {
    cargarArticulos();
    CategoriaService.getAll().then(setCategorias);
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

  // Filtro local (puedes reemplazar por API si tienes endpoints específicos)
  const articulosFiltrados = articulos.filter(a =>
    (!filtroDenominacion || a.denominacion.toLowerCase().includes(filtroDenominacion.toLowerCase())) &&
    (!filtroCategoria || String(a.categoria?.id) === filtroCategoria) &&
    (!filtroEstado ||
      (filtroEstado === "activo" && !a.eliminado) ||
      (filtroEstado === "eliminado" && a.eliminado)
    ) &&
    (!filtroPrecioMin || a.precioVenta >= Number(filtroPrecioMin)) &&
    (!filtroPrecioMax || a.precioVenta <= Number(filtroPrecioMax))
  );
  const handleVer = (row: ArticuloManufacturado) => {
    setArticuloSeleccionado(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
  };

  const handleActualizar = (row: ArticuloManufacturado) => {
    window.location.href = `/manufacturado?id=${row.id}`;
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

const darDeAlta = async (id: number) => {
  if (!window.confirm("¿Seguro que desea dar de alta este artículo manufacturado?")) return;
  try {
    await ArticuloManufacturadoService.changeEliminado(id);
    setArticulos(prev =>
      prev.map(a =>
        a.id === id ? { ...a, eliminado: false } : a
      )
    );
    alert("Artículo manufacturado dado de alta correctamente");
  } catch (err) {
    alert("Error al dar de alta el artículo manufacturado");
  }
};
  // ...resto de tu código (eliminarArticulo, handleActualizar, etc.)...

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

  return (
    <div>
      <h2>Artículos Manufacturado</h2>
      {/* Filtros */}
      <div className="mb-3 d-flex flex-wrap gap-2 align-items-end">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por denominación"
          value={filtroDenominacion}
          onChange={e => setFiltroDenominacion(e.target.value)}
          style={{ maxWidth: 180 }}
        />
        <select
          className="form-select"
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
          style={{ maxWidth: 180 }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
          ))}
        </select>
        <select
          className="form-select"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          style={{ maxWidth: 140 }}
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="eliminado">Eliminado</option>
        </select>
        <input
          type="number"
          className="form-control"
          placeholder="Precio mín."
          value={filtroPrecioMin}
          onChange={e => setFiltroPrecioMin(e.target.value)}
          style={{ maxWidth: 120 }}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Precio máx."
          value={filtroPrecioMax}
          onChange={e => setFiltroPrecioMax(e.target.value)}
          style={{ maxWidth: 120 }}
        />
        <Button variant="secondary" onClick={() => {
          setFiltroDenominacion("");
          setFiltroCategoria("");
          setFiltroEstado("");
          setFiltroPrecioMin("");
          setFiltroPrecioMax("");
        }}>
          Limpiar filtros
        </Button>
      </div>
      <Button variant="primary" className="crearManufacturadoBtn mb-3" onClick={() => window.location.href = "/manufacturado"}>
        Crear Artículo Manufacturado
      </Button>
      <ReusableTable columns={columns} data={articulosFiltrados} />

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Artículo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articuloSeleccionado && (
            <div>
              {articuloSeleccionado.imagenesArticuloManufacturado[0] ? (
                <img src={articuloSeleccionado.imagenesArticuloManufacturado[0].denominacion} className="imgModalArtManu" alt="" />
              ):(
                <div></div>
              )}
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