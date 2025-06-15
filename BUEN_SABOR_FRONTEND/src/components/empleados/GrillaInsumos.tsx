import { useState, useEffect } from "react";
import InsumoService from "../../services/ArticuloInsumoService";
import Insumo from "../../models/ArticuloInsumo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-bootstrap/Pagination";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";
import Form from "react-bootstrap/Form";

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
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modal Ver
  const [showModal, setShowModal] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);

  // Filtros
  const [filtroDenominacion, setFiltroDenominacion] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  useEffect(() => {
    cargarInsumos();
  }, [currentPage, pageSize]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      cargarInsumos();
    }
  }, [filtroDenominacion, filtroCategoria, filtroEstado, precioMin, precioMax]);

  const cargarInsumos = async () => {
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
      if (precioMin) params.append('precioMin', precioMin);
      if (precioMax) params.append('precioMax', precioMax);

      const data = await InsumoService.getAllPaginated(params);
      setPageData(data);
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
      // Recargar la página actual
      cargarInsumos();
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
    if (!window.confirm("¿Seguro que desea dar de alta este insumo?")) return;
    try {
      await InsumoService.changeEliminado(id);
      // Recargar la página actual
      cargarInsumos();
      alert("Insumo dado de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta el Insumo");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Resetear a primera página
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
    <div>
      <h2>Insumos</h2>

      {/* Filtros */}
      <Form className="mb-3 d-flex flex-wrap gap-3 align-items-end">
        <Form.Group>
          <Form.Label>Denominación</Form.Label>
          <Form.Control
            type="text"
            value={filtroDenominacion}
            onChange={(e) => setFiltroDenominacion(e.target.value)}
            placeholder="Buscar..."
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            type="text"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            placeholder="Buscar..."
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Estado</Form.Label>
          <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="eliminado">Eliminado</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Precio Mínimo</Form.Label>
          <Form.Control
            type="number"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            placeholder="Min"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Precio Máximo</Form.Label>
          <Form.Control
            type="number"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="Max"
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
      </Form>

      {/* Información de resultados */}
      {pageData && (
        <div className="mb-3 text-muted">
          Mostrando {pageData.content.length} de {pageData.totalElements} insumos
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
          <Modal.Title>Detalle del Insumo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {insumoSeleccionado && (
            <div>
              <p><b>Denominación:</b> {insumoSeleccionado.denominacion}</p>
              <p><b>Categoría:</b> {insumoSeleccionado.categoria.denominacion}</p>
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