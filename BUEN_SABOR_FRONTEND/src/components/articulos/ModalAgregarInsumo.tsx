import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ArticuloInsumo from "../../models/ArticuloInsumo";

interface Props {
  show: boolean;
  onHide: () => void;
  articulosInsumo: ArticuloInsumo[];
  insumoSeleccionado: ArticuloInsumo | null;
  setInsumoSeleccionado: (a: ArticuloInsumo | null) => void;
  cantidadInsumo: number;
  setCantidadInsumo: (n: number) => void;
  onAgregar: () => void;
}

function ModalAgregarInsumo({
  show, onHide, articulosInsumo,
  insumoSeleccionado, setInsumoSeleccionado,
  cantidadInsumo, setCantidadInsumo, onAgregar
}: Props) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Insumo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table">
          <thead>
            <tr>
              <th>Denominación</th>
              <th>Precio venta</th>
              <th>Unidad</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {articulosInsumo.map(insumo => (
              <tr key={insumo.id}>
                <td>{insumo.denominacion}</td>
                <td>${insumo.precioVenta ?? 0}</td>
                <td>{insumo.unidadMedida?.denominacion}</td>
                <td>
                  <input
                    type="radio"
                    checked={insumoSeleccionado?.id === insumo.id}
                    onChange={() => setInsumoSeleccionado(insumo)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            min={1}
            value={cantidadInsumo}
            onChange={e => setCantidadInsumo(Number(e.target.value))}
            disabled={!insumoSeleccionado}
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
          disabled={!insumoSeleccionado || cantidadInsumo <= 0}
        >
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAgregarInsumo;