import Button from "react-bootstrap/Button";
import DetalleArticuloManufacturado from "../../models/DetalleArticuloManufacturado";

interface Props {
  detalles: DetalleArticuloManufacturado[];
  onEliminar: (idx: number) => void;
  totalInsumos: number;
}

function DetalleInsumosTable({ detalles, onEliminar, totalInsumos }: Props) {
  return (
    <>
      <h4 className="mt-4">Detalle de Insumos</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Denominación</th>
            <th>Cantidad</th>
            <th>Precio venta</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((det, idx) => {
            const precioVenta = det.articuloInsumo?.precioVenta ?? 0;
            return (
              <tr key={idx}>
                <td>{det.articuloInsumo ? det.articuloInsumo.denominacion : ""}</td>
                <td>{det.cantidad}</td>
                <td>${precioVenta}</td>
                <td>${(precioVenta * det.cantidad).toFixed(2)}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => onEliminar(idx)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}><b>Total insumos</b></td>
            <td colSpan={2}>${totalInsumos.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default DetalleInsumosTable;