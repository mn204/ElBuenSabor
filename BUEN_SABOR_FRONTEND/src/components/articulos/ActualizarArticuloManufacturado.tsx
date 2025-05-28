import { useState, useEffect } from "react";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import CategoriaService from "../../services/CategoriaService";
import UnidadMedidaService from "../../services/UnidadMedidaService";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import Categoria from "../../models/Categoria";
import UnidadMedida from "../../models/UnidadMedida";
import ArticuloInsumo from "../../models/ArticuloInsumo";
import DetalleArticuloManufacturado from "../../models/DetalleArticuloManufacturado";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "react-router-dom";

function ActualizarArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [denominacion, setDenominacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tiempoEstimadoMinutos, setTiempoEstimadoMinutos] = useState(0);
  const [preparacion, setPreparacion] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidad, setUnidad] = useState<string>("");
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [porcentajeGanancia, setPorcentajeGanancia] = useState(0);
  const [detalles, setDetalles] = useState<DetalleArticuloManufacturado[]>([]);
  const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<ArticuloInsumo | null>(null);
  const [cantidadInsumo, setCantidadInsumo] = useState<number>(1);
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const [articuloId, setArticuloId] = useState<number | null>(idFromUrl ? Number(idFromUrl) : null);

  useEffect(() => {
    ArticuloManufacturadoService.getAll().then(setArticulos);
    CategoriaService.getAll().then(setCategorias);
    UnidadMedidaService.getAll().then(setUnidadesMedida);
    ArticuloInsumoService.getAll().then(setArticulosInsumo);
  }, []);

  // Cargar datos del artículo seleccionado
  useEffect(() => {
  if (articuloId) {
    ArticuloManufacturadoService.getById(articuloId).then(art => {
      setDenominacion(art.denominacion ?? "");
      setDescripcion(art.descripcion ?? "");
      setTiempoEstimadoMinutos(art.tiempoEstimadoMinutos ?? 0);
      setPreparacion(art.preparacion ?? "");
      setCategoria(art.categoria?.id?.toString() ?? "");
      setUnidad(art.unidadMedida?.id?.toString() ?? "");
      setDetalles(art.detalles ?? []);
      console.log(art);
      // Calcular costo total de insumos
      const costoInsumos = (art.detalles ?? []).reduce((acc, det) => {
        const precio = det.articuloInsumo?.precioVenta ?? 0;
        return acc + precio * det.cantidad;
      }, 0);
      // Calcular porcentaje de ganancia si hay costo
      if (costoInsumos > 0 && art.precioVenta) {
        setPorcentajeGanancia(((art.precioVenta - costoInsumos) / costoInsumos) * 100);
      } else {
        setPorcentajeGanancia(0);
      }
    });
  }
}, [articuloId]);

  const totalInsumos = detalles.reduce((acc, det) => {
    const precio = det.articuloInsumo?.precioVenta ?? 0;
    return acc + precio * det.cantidad;
  }, 0);
  const totalConGanancia = totalInsumos + (totalInsumos * (porcentajeGanancia / 100));

  const handleAgregarInsumo = () => {
    if (insumoSeleccionado && cantidadInsumo > 0) {
      setDetalles(prev => [
        ...prev,
        {
          cantidad: cantidadInsumo,
          articuloInsumo: insumoSeleccionado,
          eliminado: false,
        } as DetalleArticuloManufacturado,
      ]);
      setInsumoSeleccionado(null);
      setCantidadInsumo(1);
    }
  };

  const handleEliminarDetalle = (index: number) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const limpiarFormulario = () => {
    setDenominacion("");
    setDescripcion("");
    setTiempoEstimadoMinutos(0);
    setPreparacion("");
    setCategoria("");
    setUnidad("");
    setDetalles([]);
    setPorcentajeGanancia(0);
    setArticuloId(null);
  };

  const handleActualizar = async () => {
    if (!articuloId) return;
    try {
      const manufacturado = new ArticuloManufacturado();
      
        const unidadMedidaSeleccionada = unidadesMedida.find(um => um.id === Number(unidad));
        if (!unidadMedidaSeleccionada) {
            alert("Unidad de medida inválida");
            return;
        }

        const categoriaSeleccionada = categorias.find(cat => cat.id === Number(categoria));
        if (!categoriaSeleccionada) {
            alert("Categoría inválida");
            return;
        }
      manufacturado.denominacion = denominacion;
        manufacturado.precioVenta = totalConGanancia;
        manufacturado.unidadMedida = { id: unidadMedidaSeleccionada.id } as UnidadMedida;
        manufacturado.categoria = { id: categoriaSeleccionada.id } as Categoria;
        manufacturado.descripcion = descripcion;
        manufacturado.tiempoEstimadoMinutos = tiempoEstimadoMinutos;
        manufacturado.preparacion = preparacion;
        manufacturado.detalles = detalles.map(det => ({
            cantidad: det.cantidad,
            articuloInsumo: det.articuloInsumo?.id
                ? { id: det.articuloInsumo.id } as ArticuloInsumo
                : undefined,
            eliminado: false,
        }));
        console.log(manufacturado);
        manufacturado.imagenesArticuloManufacturado = [];
      await ArticuloManufacturadoService.update(articuloId, manufacturado);
      alert("Artículo manufacturado actualizado correctamente");
      limpiarFormulario();
    } catch (error) {
      alert("Error al actualizar el artículo manufacturado");
    }
  };

  return (
    <div className="formArticuloManufacturado d-flex flex-column gap-3 justify-content-center align-items-center">
      <h2>Actualizar Artículo Manufacturado</h2>
      <div>
        <label>Seleccionar artículo:</label>
        <select value={articuloId ?? ""} onChange={e => setArticuloId(Number(e.target.value))}>
          <option value="">Seleccione uno</option>
          {articulos.map(a => (
            <option key={a.id} value={a.id}>{a.denominacion}</option>
          ))}
        </select>
      </div>
      <form className="d-flex flex-column gap-3 text-start" onSubmit={e => e.preventDefault()}>
        <div>
          <label>Denominación:</label>
          <input value={denominacion} onChange={e => setDenominacion(e.target.value)} />
        </div>
        <div>
          <label>Descripción:</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div>
          <label>Categoría:</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Seleccione una opción</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Unidad de Medida:</label>
          <select value={unidad} onChange={e => setUnidad(e.target.value)}>
            <option value="">Seleccione una opción</option>
            {unidadesMedida.map(um => (
              <option key={um.id} value={um.id}>{um.denominacion}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tiempo (m):</label>
          <input type="number" value={tiempoEstimadoMinutos} onChange={e => setTiempoEstimadoMinutos(Number(e.target.value))} />
        </div>
        <div>
          <label>Preparación:</label>
          <textarea value={preparacion} onChange={e => setPreparacion(e.target.value)} />
        </div>
      </form>

      <div>
        <h4>Detalle de Insumos</h4>
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
                    <Button variant="danger" size="sm" onClick={() => handleEliminarDetalle(idx)}>
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
        <div>
          <label>Agregar insumo:</label>
          <select
            value={insumoSeleccionado?.id ?? ""}
            onChange={e => {
              const insumo = articulosInsumo.find(i => i.id === Number(e.target.value));
              setInsumoSeleccionado(insumo ?? null);
            }}
          >
            <option value="">Seleccione un insumo</option>
            {articulosInsumo.map(insumo => (
              <option key={insumo.id} value={insumo.id}>{insumo.denominacion}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={cantidadInsumo}
            onChange={e => setCantidadInsumo(Number(e.target.value))}
            disabled={!insumoSeleccionado}
            style={{ width: 80, marginLeft: 8, marginRight: 8 }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAgregarInsumo}
            disabled={!insumoSeleccionado || cantidadInsumo <= 0}
          >
            Agregar
          </Button>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <label>% Ganancia:</label>
        <input
          type="number"
          min={0}
          value={porcentajeGanancia}
          onChange={e => setPorcentajeGanancia(Number(e.target.value))}
          style={{ width: 80 }}
        />
        <label><b>Total con ganancia:</b></label>
        <input
          type="text"
          value={`$${totalConGanancia.toFixed(2)}`}
          readOnly
          style={{ width: 120, fontWeight: "bold" }}
        />
      </div>
      <Button
        variant="warning"
        className="mt-3"
        onClick={handleActualizar}
        disabled={
          !articuloId ||
          !denominacion ||
          !descripcion ||
          !preparacion ||
          !categoria ||
          !unidad ||
          detalles.length === 0
        }
      >
        Actualizar Artículo Manufacturado
      </Button>
    </div>
  );
}

export default ActualizarArticuloManufacturado;