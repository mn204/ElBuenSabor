import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ArticuloInsumo from "../../../models/ArticuloInsumo";
import SucursalInsumo from "../../../models/SucursalInsumo";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import SucursalInsumoService from "../../../services/SucursalInsumoService";

function FormStock() {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [stockMinimo, setStockMinimo] = useState(0);
  const [stockMaximo, setStockMaximo] = useState(0);
  const [stockActual, setStockActual] = useState(0);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const data = await ArticuloInsumoService.getAll();
        setInsumos(data);
      } catch (err) {
        console.error("Error al cargar insumos:", err);
      }
    };
    fetchInsumos();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const insumoSeleccionado = insumos.find(i => i.id === selectedId);
    if (!insumoSeleccionado) return;

    const sucursalInsumo: SucursalInsumo = {
      stockMinimo,
      stockMaximo,
      stockActual,
      eliminado: false,
      sucursal: insumoSeleccionado.sucursalInsumo?.sucursal!,
      insumoSeleccionado
    };

    
    const res = SucursalInsumoService.create(sucursalInsumo);
    console.log(res)
    const actualizado: ArticuloInsumo = {
      ...insumoSeleccionado,
      sucursalInsumo
    };
    ArticuloInsumoService.update(actualizado.id!,actualizado)
  };

  return (
    <Form onSubmit={handleSubmit} className="m-auto container" style={{maxWidth: 350}}>
      <Form.Group className="mb-3" controlId="insumoSelect">
        <Form.Label>Seleccionar Insumo</Form.Label>
        <Form.Select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          required
        >
          <option value="" disabled>-- Seleccionar --</option>
          {insumos.map((insumo) => (
            <option key={insumo.id} value={insumo.id}>
              {insumo.denominacion}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="stockMinimo">
        <Form.Label>Stock Mínimo</Form.Label>
        <Form.Control
          type="number"
          value={stockMinimo}
          onChange={(e) => setStockMinimo(Number(e.target.value))}
          min={0}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="stockMaximo">
        <Form.Label>Stock Máximo</Form.Label>
        <Form.Control
          type="number"
          value={stockMaximo}
          onChange={(e) => setStockMaximo(Number(e.target.value))}
          min={0}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="stockActual">
        <Form.Label>Stock Actual</Form.Label>
        <Form.Control
          type="number"
          value={stockActual}
          onChange={(e) => setStockActual(Number(e.target.value))}
          min={0}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Crear Stock
      </Button>
    </Form>
  );
}

export default FormStock;