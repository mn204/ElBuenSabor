import { useState, useEffect } from "react";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import { ReusableTable } from "../Tabla";
import "../../styles/GrillaArticuloManufactura.css";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonVer from "../layout/BotonVer";
import BotonAlta from "../layout/BotonAlta";
import { Link } from "react-router-dom";

interface PageResponse {
  content: ArticuloManufacturado[];
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

function GrillaArticuloManufacturado() {
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
  }, [currentPage, pageSize]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      cargarArticulos();
    }
  }, [filtroDenominacion, filtroCategoria, filtroEstado, filtroPrecioMin, filtroPrecioMax]);

  const cargarArticulos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construir parámetros de búsqueda
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      // Agregar filtros si existen
      if (filtroDenominacion) params.append('denominacion', filtroDenominacion);
      if (filtroCategoria) params.append('categoria', filtroCategoria);
      if (filtroEstado) params.append('estado', filtroEstado);
      if (filtroPrecioMin) params.append('precioMin', filtroPrecioMin);
      if (filtroPrecioMax) params.append('precioMax', filtroPrecioMax);

      const data = await ArticuloManufacturadoService.getAllPaginated(params);
      setPageData(data);
    } catch (err) {
      setError("Error al cargar los artículos manufacturados");
    } finally {
      setLoading(false);
    }
  };

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
      // Recargar la página actual
      cargarArticulos();
      alert("Artículo manufacturado eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el artículo manufacturado");
    }
  };

  const darDeAlta = async (id: number) => {
    if (!window.confirm("¿Seguro que desea dar de alta este artículo manufacturado?")) return;
    try {
      await ArticuloManufacturadoService.changeEliminado(id);
      // Recargar la página actual
      cargarArticulos();
      alert("Artículo manufacturado dado de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta el artículo manufacturado");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Resetear a primera página
  };

  const limpiarFiltros = () => {
    setFiltroDenominacion("");
    setFiltroCategoria("");
    setFiltroEstado("");
    setFiltroPrecioMin("");
    setFiltroPrecioMax("");
  };

  const renderPagination = () => {
    if (!pageData || pageData.totalPages <= 1) return null;

    const items = [];
    const totalPages = pageData.totalPages;
    const current = pageData.number;

    // Botón Previous
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={pageData.first}
        onClick={() => handlePageChange(current - 1)}
      />
    );

    // Páginas
    const startPage = Math.max(0, current - 2);
    const endPage = Math.min(totalPages - 1, current + 2);

    if (startPage > 0) {
      items.push(
        <Pagination.Item key={0} onClick={() => handlePageChange(0)}>
          1
        </Pagination.Item>
      );
      if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === current}
          onClick={() => handlePageChange(page)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <Pagination.Item key={totalPages - 1} onClick={() => handlePageChange(totalPages - 1)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Botón Next
    items.push(
      <Pagination.Next
        key="next"
        disabled={pageData.last}
        onClick={() => handlePageChange(current + 1)}
      />
    );

    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  // Definición de columnas para la tabla reusable
  const columns = [
    { key: "denominacion", label: "Denominación" },
    {
      key: "categoria",
      label: "Categoría",
      render: (_: any, row: ArticuloManufacturado) => row.categoria?.denominacion || "-",
    },
    {
      key: "precioVenta",
      label: "Precio Venta",
      render: (value: number) => `$${value}`,
    },
    {
      key: "tiempoEstimadoMinutos",
      label: "Tiempo Est. (min)",
      render: (value: number) => value || "-",
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
        <div className="d-flex justify-content-center">
          <BotonVer onClick={() => handleVer(row)} />
          <BotonModificar onClick={() => handleActualizar(row)} />
          {!row.eliminado ? (
            <BotonEliminar onClick={() => eliminarArticulo(row.id!)} />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id!)} />
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando artículos manufacturados...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="position-relative">
      <h2>Artículos Manufacturados</h2>

      {/* Filtros */}
      <div className="filtrosybtn d-flex justify-content-between align-items-center">
        <Form className="m-4 d-flex flex-wrap gap-3 align-items-end">
          <Form.Group>
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              type="text"
              value={filtroDenominacion}
              onChange={(e) => setFiltroDenominacion(e.target.value)}
              placeholder="Buscar..."
              style={{ maxWidth: 180 }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{ maxWidth: 180 }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ maxWidth: 140 }}
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="eliminado">Eliminado</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio Mínimo</Form.Label>
            <Form.Control
              type="number"
              value={filtroPrecioMin}
              onChange={(e) => setFiltroPrecioMin(e.target.value)}
              placeholder="Min"
              style={{ maxWidth: 120 }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio Máximo</Form.Label>
            <Form.Control
              type="number"
              value={filtroPrecioMax}
              onChange={(e) => setFiltroPrecioMax(e.target.value)}
              placeholder="Max"
              style={{ maxWidth: 120 }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Elementos por página</Form.Label>
            <Form.Select 
              value={pageSize} 
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              style={{ width: '100px' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Button variant="secondary" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </Form.Group>
        </Form>
        <Link className="btn border-success" style={{ right: 10, top: 10 }} to="/FormularioManufacturado">
          Crear Artículo Manufacturado
        </Link>
      </div>

      {/* Información de resultados */}
      {pageData && (
        <div className="mb-3 text-muted">
          Mostrando {pageData.content.length} de {pageData.totalElements} artículos manufacturados
          {pageData.totalPages > 1 && (
            <span> - Página {pageData.number + 1} de {pageData.totalPages}</span>
          )}
        </div>
      )}

      {/* Tabla */}
      <ReusableTable columns={columns} data={pageData?.content || []} />

      {/* Paginación */}
      {renderPagination()}

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