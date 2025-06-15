import { useState, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Articulo from "../../models/Articulo";

interface Props {
  show: boolean;
  onHide: () => void;
  articulos: Articulo[];
  articuloSeleccionado: Articulo | null;
  setArticuloSeleccionado: (a: Articulo| null) => void;
  cantidadInsumo: number;
  setCantidadInsumo: (n: number) => void;
  onAgregar: () => void;
}

function ModalAgregarArticulo({
  show, onHide, articulos,
  articuloSeleccionado, setArticuloSeleccionado,
  cantidadInsumo, setCantidadInsumo,
  onAgregar
}: Props) {
  // Filtros
  const [filtroDenominacion, setFiltroDenominacion] = useState("");
  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Opciones únicas para selects
  const unidades = useMemo(
    () =>
      Array.from(
        new Set(articulos.map(i => i.unidadMedida?.denominacion).filter(Boolean))
      ),
    [articulos]
  );
  const categorias = useMemo(
    () =>
      Array.from(
        new Set(articulos.map(i => i.categoria?.denominacion).filter(Boolean))
      ),
    [articulos]
  );

  // Filtrado
  const insumosFiltrados = useMemo(
    () =>
      articulos.filter(insumo =>
        (!filtroDenominacion ||
          insumo.denominacion.toLowerCase().includes(filtroDenominacion.toLowerCase())) &&
        (!filtroUnidad || insumo.unidadMedida?.denominacion === filtroUnidad) &&
        (!filtroCategoria || insumo.categoria?.denominacion === filtroCategoria)
      ),
    [articulos, filtroDenominacion, filtroUnidad, filtroCategoria]
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Insumo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Filtros */}
        <div className="mb-3 d-flex gap-2 flex-wrap">
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
            value={filtroUnidad}
            onChange={e => setFiltroUnidad(e.target.value)}
            style={{ maxWidth: 160 }}
          >
            <option value="">Todas las unidades</option>
            {unidades.map(um => (
              <option key={um} value={um}>{um}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Denominación</th>
              <th>Precio venta</th>
              <th>Unidad</th>
              <th>Categoría</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {insumosFiltrados.map(insumo => (
              <tr key={insumo.id}>
                <td>{insumo.denominacion}</td>
                <td>${insumo.precioVenta ?? 0}</td>
                <td>{insumo.unidadMedida?.denominacion}</td>
                <td>{insumo.categoria?.denominacion}</td>
                <td>
                  <input
                    type="radio"
                    checked={articuloSeleccionado?.id === insumo.id}
                    onChange={() => setArticuloSeleccionado(insumo)}
                  />
                </td>
              </tr>
            ))}
            {insumosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay insumos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-2">
          <label>Cantidad:</label>
          <input
            type="number"
            min={0.01}
            step="any"
            value={cantidadInsumo}
            onChange={e => setCantidadInsumo(Number(e.target.value))}
            className="form-control"
            style={{ maxWidth: 120, display: "inline-block", marginLeft: 8 }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={onAgregar}
          disabled={!articuloSeleccionado || cantidadInsumo <= 0}
        >
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAgregarArticulo;