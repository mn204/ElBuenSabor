import { useState, useEffect } from "react";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import CategoriaService from "../../services/CategoriaService";
import ArticuloManufacturadoService from "../../services/ArticuloManufacturadoService";
import ArticuloInsumo from "../../models/ArticuloInsumo";
import Categoria from "../../models/Categoria";
import DetalleArticuloManufacturado from "../../models/DetalleArticuloManufacturado";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import UnidadMedida from "../../models/UnidadMedida";
import ModalAgregarInsumo from "./ModalAgregarInsumo";
import DetalleInsumosTable from "./DetalleInsumosTable";
import FormArticuloFields from "./FormArticuloFields";
import "../../styles/ArticuloManufacturado.css";
import Button from "react-bootstrap/Button";
import UnidadMedidaService from "../../services/UnidadMedidaService.ts";
import HistoricoPrecioVenta from "../../models/HistoricoPrecioVenta.ts";
import { useSearchParams } from "react-router-dom";

function FormArticuloManufacturado() {
  // Estados principales
  const [denominacion, setDenominacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tiempoEstimadoMinutos, setTiempoEstimadoMinutos] = useState(0);
  const [preparacion, setPreparacion] = useState("");
  const [unidad, setUnidad] = useState<string>("");
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [categoria, setCategoria] = useState<string>("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [porcentajeGanancia, setPorcentajeGanancia] = useState(0);
  const [detalles, setDetalles] = useState<DetalleArticuloManufacturado[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<ArticuloInsumo | null>(null);
  const [cantidadInsumo, setCantidadInsumo] = useState<number>(1);
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  
  // Cargar datos del artículo seleccionado
    useEffect(() => {
    if (idFromUrl) {
      ArticuloManufacturadoService.getById(Number(idFromUrl)).then(art => {
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
        if (costoInsumos > 0 && art.precioVenta){
          setPorcentajeGanancia(((art.precioVenta - costoInsumos)/costoInsumos) * 100);
        } else {
          setPorcentajeGanancia(0);
        }
      });
    }
  }, [idFromUrl]);
  useEffect(() => {
    CategoriaService.getAll().then(setCategorias).catch(() => setCategorias([]));
  }, []);
  useEffect(() => {
    if (showModal) {
      ArticuloInsumoService.getAll().then(setArticulosInsumo);
    }
  }, [showModal]);

  useEffect(() => {
    // Si tenés un UnidadMedidaService con getAll
    UnidadMedidaService.getAll()
        .then(setUnidadesMedida)
        .catch(() => setUnidadesMedida([]));
  }, []);
  const totalInsumos = detalles.reduce((acc, det) => {
    const precio = det.articuloInsumo?.precioVenta ?? 0;
    return acc + precio * det.cantidad;
  }, 0);
  const totalConGanancia = totalInsumos + (totalInsumos * (porcentajeGanancia / 100));

  const AgregarInsumo = () => {
    if (insumoSeleccionado) {
      setDetalles(prev => [
        ...prev,
        {
          cantidad: 1,
          articuloInsumo: insumoSeleccionado,
          eliminado: false,
        } as DetalleArticuloManufacturado,
      ]);
      setShowModal(false);
      setInsumoSeleccionado(null);
    }
  };

  const EliminarDetalle = (index: number) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const limpiarFormulario = () => {
    setDenominacion("");
    setDescripcion("");
    setTiempoEstimadoMinutos(0);
    setPreparacion("");
    setCategoria("");
    setDetalles([]);
    setPorcentajeGanancia(0);
  };
  const handleActualizar = async () => {
    if (!idFromUrl) return;
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
          id: det.id ?? undefined,
          cantidad: det.cantidad,
          articuloInsumo: det.articuloInsumo?.id
              ? { id: det.articuloInsumo.id } as ArticuloInsumo
              : undefined,
          eliminado: false,
      }));
      console.log(manufacturado);
      manufacturado.imagenesArticuloManufacturado = [];
      await ArticuloManufacturadoService.update(Number(idFromUrl), manufacturado);
      alert("Artículo manufacturado actualizado correctamente");
      limpiarFormulario();
      } catch (error) {
        alert("Error al actualizar el artículo manufacturado");
      }
  };
  const Guardar = async () => {
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


      const precioVenta = new HistoricoPrecioVenta();
      precioVenta.precio = totalConGanancia;
      precioVenta.fecha = new Date();
      precioVenta.eliminado = false;
      manufacturado.denominacion = denominacion;
      manufacturado.precioVenta = totalConGanancia;
      manufacturado.historicosPrecioVenta = [precioVenta];
      manufacturado.historicosPrecioCompra = [];
      manufacturado.imagenes = [];
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
      manufacturado.imagenesArticuloManufacturado = [];

      console.log("Detalles a guardar:", manufacturado);
      await ArticuloManufacturadoService.create(manufacturado);
      alert("Artículo manufacturado guardado correctamente");
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el artículo manufacturado");
    }
  };

  const CambiarCantidadDetalle = (index: number, cantidad: number) => {
    setDetalles(prev =>
      prev.map((det, i) =>
        i === index ? { ...det, cantidad } : det
      )
    );
  };
  return (
    <div className="formArticuloManufacturado d-flex flex-column gap-3 justify-content-center align-items-center">
      <h2>Formulario de Artículo Manufacturado</h2>
      <FormArticuloFields
        denominacion={denominacion}
        setDenominacion={setDenominacion}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        tiempoEstimadoMinutos={tiempoEstimadoMinutos}
        setTiempoEstimadoMinutos={setTiempoEstimadoMinutos}
        preparacion={preparacion}
        setPreparacion={setPreparacion}
        categoria={categoria}
        setCategoria={setCategoria}
        categorias={categorias}
        unidad={unidad}
        setUnidad={setUnidad}
        unidadesMedida={unidadesMedida}
      />
      <Button className="agregarInsumo" variant="primary" onClick={() => setShowModal(true)}>
        Agregar Insumo
      </Button>
      <ModalAgregarInsumo
        show={showModal}
        onHide={() => setShowModal(false)}
        articulosInsumo={articulosInsumo}
        insumoSeleccionado={insumoSeleccionado}
        setInsumoSeleccionado={setInsumoSeleccionado}
        cantidadInsumo={cantidadInsumo}
        setCantidadInsumo={setCantidadInsumo}
        onAgregar={AgregarInsumo}
      />
      <DetalleInsumosTable
        detalles={detalles}
        onEliminar={EliminarDetalle}
        onCantidadChange={CambiarCantidadDetalle}
        totalInsumos={totalInsumos}
      />
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
      {!idFromUrl ? (
        <Button
          variant="success"
          className="mt-3"
          onClick={Guardar}
          disabled={
            !denominacion ||
            !descripcion ||
            !preparacion ||
            !categoria ||
            detalles.length === 0
          }
        >
          Guardar Artículo Manufacturado
        </Button>
      ) : (
        <Button
        variant="warning"
        className="mt-3"
        onClick={handleActualizar}
        disabled={
          !idFromUrl ||
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
      )}
    </div>
  );
}

export default FormArticuloManufacturado;