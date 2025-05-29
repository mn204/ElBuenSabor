import DetalleArticuloManufacturado from "../../models/DetalleArticuloManufacturado";

// DetalleInsumosTable.tsx
type Props = {
  detalles: DetalleArticuloManufacturado[];
  onEliminar: (index: number) => void;
  onCantidadChange: (index: number, cantidad: number) => void;
  totalInsumos: number;
};

const DetalleInsumosTable = ({ detalles, onEliminar, onCantidadChange, totalInsumos }: Props) => (
  <table className="table">
    <thead>
      <tr>
        <th>Insumo</th>
        <th>Cantidad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {detalles.map((det, idx) => (
        <tr key={idx}>
          <td>{det.articuloInsumo?.denominacion}</td>
          <td>
            <input
              type="number"
              min={1}
              value={det.cantidad}
              onChange={e => onCantidadChange(idx, Number(e.target.value))}
              style={{ width: 80 }}
            />
          </td>
          <td>
            <button className="btn btn-danger btn-sm" onClick={() => onEliminar(idx)}>
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan={2}><b>Total insumos</b></td>
        <td>${totalInsumos.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>
);

export default DetalleInsumosTable;