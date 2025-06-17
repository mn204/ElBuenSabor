import { useState, useEffect } from "react";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { ReusableTable } from "../Tabla";
import "../../styles/GrillaArticuloManufactura.css";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonVer from "../layout/BotonVer";
import BotonAlta from "../layout/BotonAlta";
import { Link } from "react-router-dom";

function GrillaArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

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
      // Simulamos paginación para el ejemplo
      setTotalPages(Math.ceil(data.length / size));
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

  // Aplicar paginación local
  const articulosPaginados = articulosFiltrados.slice(page * size, (page + 1) * size);

  const handleVer = (row: ArticuloManufacturado) => {
    setArticuloSeleccionado(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
  };

  const handleActualizar = (row: ArticuloManufacturado) => {
    window.location.href = `/FormularioManufacturado?id=${row.id}`;
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

  // Definición de columnas para la tabla reusable
  const columns = [
    {
      key: "imagen",
      label: "Imagen",
      render: (_: any, row: ArticuloManufacturado) => {
        const imagenUrl = row.imagenes?.[0]?.denominacion;
        return imagenUrl ? (
          <img
            src={imagenUrl}
            alt="Imagen"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />
        ) : (
          "Sin imagen"
        );
      }
    },
    {
      key: "id",
      label: "ID",
      render: (_: any, row: ArticuloManufacturado) => row.id?.toString() || "-",
    },
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
      render: (_: any, row: ArticuloManufacturado) => (
        <div className="d-flex gap-2 justify-content-center">
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
            <BotonAlta onClick={() => darDeAlta(row.id!)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="position-relative">
      <h2>Productos</h2>
      {/* Filtros */}
      <div className="filtros-container bg-light p-4 rounded mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por denominación"
              value={filtroDenominacion}
              onChange={e => setFiltroDenominacion(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filtroCategoria}
              onChange={e => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="eliminado">Eliminado</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Precio mín."
              value={filtroPrecioMin}
              onChange={e => setFiltroPrecioMin(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Precio máx."
              value={filtroPrecioMax}
              onChange={e => setFiltroPrecioMax(e.target.value)}
            />
          </div>
          <div className="col-md-1">
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={() => {
                setFiltroDenominacion("");
                setFiltroCategoria("");
                setFiltroEstado("");
                setFiltroPrecioMin("");
                setFiltroPrecioMax("");
                setPage(0);
              }}
            >
              Ver Todos
            </Button>
          </div>
        </div>
        <Link className="btn border-success" style={{ right: 10, top: 10 }} to="/FormularioManufacturado">
          Crear Artículo Manufacturado
        </Link>
      </div>

      {/* Tabla con paginación */}
      <div className="p-3 border rounded bg-white shadow-sm">
        {articulosPaginados.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              No hay artículos manufacturados para mostrar
            </p>
          </div>
        ) : (
          <>
            {/* Tabla */}
            <div className="table-responsive">
              <ReusableTable columns={columns} data={articulosPaginados} />
            </div>

            {/* Paginación */}
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div className="text-muted">
                Mostrando {articulosPaginados.length} artículos de {articulosFiltrados.length} total
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft />
                </Button>
                <span className="px-2">
                  Página {page + 1} de {Math.ceil(articulosFiltrados.length / size) || 1}
                </span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page >= Math.ceil(articulosFiltrados.length / size) - 1}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Artículo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articuloSeleccionado && (
            <div>
              {articuloSeleccionado.imagenes[0] ? (
                <img src={articuloSeleccionado.imagenes[0].denominacion} className="imgModalArtManu" alt="" />
              ) : (
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