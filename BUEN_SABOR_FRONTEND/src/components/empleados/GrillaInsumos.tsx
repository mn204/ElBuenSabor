import { useState, useEffect, useCallback } from "react";
import InsumoService from "../../services/ArticuloInsumoService";
import CategoriaService from "../../services/CategoriaService";
import Insumo from "../../models/ArticuloInsumo";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import type ArticuloInsumo from "../../models/ArticuloInsumo";

interface PageResponse {
  content: Insumo[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
}

function GrillaInsumos() {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Modal Ver
  const [showModal, setShowModal] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);

  // Filtros
  const [filtroDenominacion, setFiltroDenominacion] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(""); // "", "activo", "eliminado"
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    cargarInsumos();
    CategoriaService.getAll().then(setCategorias);
  }, []);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPage(0);
  }, [filtroDenominacion, filtroCategoria, filtroEstado, filtroPrecioMin, filtroPrecioMax]);

  const cargarInsumos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ArticuloInsumoService.getAll();
      setInsumos(data);
    } catch (err) {
      setError("Error al cargar los artículos manufacturados");
    } finally {
      setLoading(false);
    }
  };

  // Filtro local (puedes reemplazar por API si tienes endpoints específicos)
  const insumosFiltrados = insumos.filter(a =>
    (!filtroDenominacion || a.denominacion.toLowerCase().includes(filtroDenominacion.toLowerCase())) &&
    (!filtroCategoria || String(a.categoria?.id) === filtroCategoria) &&
    (!filtroEstado ||
      (filtroEstado === "activo" && !a.eliminado) ||
      (filtroEstado === "eliminado" && a.eliminado)
    ) &&
    (!filtroPrecioMin || a.precioVenta >= Number(filtroPrecioMin)) &&
    (!filtroPrecioMax || a.precioVenta <= Number(filtroPrecioMax))
  );

  // Calcular páginas totales basado en los elementos filtrados
  const totalPages = Math.ceil(insumosFiltrados.length / size);
  
  // Aplicar paginación a los elementos filtrados
  const insumosPaginados = insumosFiltrados.slice(page * size, (page + 1) * size);

  const eliminarInsumo = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar este insumo?")) return;
    try {
      await InsumoService.delete(id);
      cargarInsumos();
      alert("Insumo eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el insumo");
    }
  };

  const handleActualizar = (ins: Insumo) => {
    window.location.href = `/FormularioInsumo?id=${ins.id}`;
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
    if (!window.confirm("¿Seguro que desea dar de alta este insumo?")) return;
    try {
      await InsumoService.changeEliminado(id);
      cargarInsumos();
      alert("Insumo dado de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta el Insumo");
    }
  };

  const limpiarFiltros = () => {
    setFiltroDenominacion("");
    setFiltroCategoria("");
    setFiltroEstado("");
    setFiltroPrecioMax("");
    setFiltroPrecioMin("");
  };

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
          <BotonVer onClick={() => handleVer(row)} />
          <BotonModificar onClick={() => handleActualizar(row)} />
          {!row.eliminado ? (
            <BotonEliminar onClick={() => eliminarInsumo(row.id!)} />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id!)} />
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando insumos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="position-relative">
      <h2>Insumos</h2>
      <div className="filtrosybtn d-flex justify-content-between align-items-center">
        <div className="m-4 d-flex flex-wrap gap-2 align-items-end">
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
              <option key={cat.id} value={cat.id?.toString()}>
                {cat.denominacion}
              </option>
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
          <Button variant="secondary" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </div>
        <Link to='/FormularioInsumo' className="btn border-success" style={{ right: 10, top: 10 }}>
          Crear Insumo
        </Link>
      </div>

      {/* Tabla */}
      <div className="p-3 border rounded bg-white shadow-sm">
        {insumosFiltrados.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              No hay insumos para mostrar
            </p>
          </div>
        ) : (
          <>
            {/* Tabla */}
            <div className="table-responsive">
              <ReusableTable columns={columns} data={insumosPaginados} />
            </div>

            {/* Paginación */}
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div className="text-muted">
                Mostrando {page * size + 1}-{Math.min((page + 1) * size, insumosFiltrados.length)} de {insumosFiltrados.length} insumos
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
                  Página {page + 1} de {totalPages || 1}
                </span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page >= totalPages - 1 || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal detalle */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Insumo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {insumoSeleccionado && (
            <div>
              <p><b>Denominación:</b> {insumoSeleccionado.denominacion}</p>
              <p><b>Categoría:</b> {insumoSeleccionado.categoria?.denominacion}</p>
              <p><b>Unidad de Medida:</b> {insumoSeleccionado.unidadMedida?.denominacion || "-"}</p>
              <p><b>Precio Venta:</b> ${insumoSeleccionado.precioVenta}</p>
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

export default GrillaInsumos;