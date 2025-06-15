import { useState } from "react";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService.ts";
import ArticuloInsumo from "../../../models/ArticuloInsumo.ts";
import Categoria from "../../../models/Categoria.ts";
import DetalleArticuloManufacturado from "../../../models/DetalleArticuloManufacturado.ts";
import ArticuloManufacturado from "../../../models/ArticuloManufacturado.ts";
import UnidadMedida from "../../../models/UnidadMedida.ts";
import ModalAgregarInsumo from "../../articulos/ModalAgregarInsumo.tsx";
import DetalleInsumosTable from "../../articulos/DetalleInsumosTable.tsx";
import FormArticuloFields from "./FormArticuloFields";
import "../../../styles/ArticuloManufacturado.css";
import Button from "react-bootstrap/Button";
import { useManufacturado } from "../../../hooks/useManufactuado.ts";
import { useCargaDatosIniciales } from "../../../hooks/useCargarDatosIinicales.ts";
import { useModal } from "../../../hooks/useModal.ts";
import ImagenArticulo from "../../../models/ImagenArticulo.ts";
import TipoArticulo from "../../../models/enums/TipoArticulo.ts";
import { subirACloudinary } from "../../../funciones/funciones.tsx";

function FormArticuloManufacturado() {
  const {
    idFromUrl,
    denominacion, setDenominacion,
    descripcion, setDescripcion,
    tiempoEstimadoMinutos, setTiempoEstimadoMinutos,
    preparacion, setPreparacion,
    unidad, setUnidad,
    categoria, setCategoria,
    detalles, setDetalles,
    imagenesExistentes,
    eliminado,
    porcentajeGanancia, setPorcentajeGanancia,
    eliminarImagenExistente,
    imagenes, setImagenes,
    limpiarFormulario, EliminarDetalle,
    eliminarImagenNueva, CambiarCantidadDetalle
  } = useManufacturado();
  const { unidadesMedida, categorias } = useCargaDatosIniciales();
  const { showModal, setShowModal, articulosInsumo } = useModal();
  // Estados principales
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<ArticuloInsumo | null>(null);
  const [cantidadInsumo, setCantidadInsumo] = useState<number>(1);
  const [showModalCategoria, setShowModalCategoria] = useState(false);

  


  // Utilidades
  const totalInsumos = detalles.reduce((acc, det) => {
    const precio = det.articuloInsumo?.precioVenta ?? 0;
    return acc + precio * det.cantidad;
  }, 0);
  const totalConGanancia = totalInsumos + (totalInsumos * (porcentajeGanancia / 100));

  // Handlers
  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const nuevosArchivos = Array.from(e.target.files as FileList);

      // Filtra para evitar duplicados por nombre y tamaño
      const archivosFiltrados = nuevosArchivos.filter(nuevo =>
        !imagenes.some(img => img.name === nuevo.name && img.size === nuevo.size)
      );

      if (archivosFiltrados.length < nuevosArchivos.length) {
        alert("Algunas imágenes ya fueron seleccionadas y no se agregarán de nuevo.");
      }

      setImagenes(prev => [...prev, ...archivosFiltrados]);
    }
  };
  
  const AgregarInsumo = () => {
    if (insumoSeleccionado) {
      setDetalles(prev => {
        const index = prev.findIndex(
          det => det.articuloInsumo?.id === insumoSeleccionado.id
        );
        if (index !== -1) {
          // Si ya existe, suma la cantidad
          const nuevosDetalles = [...prev];
          nuevosDetalles[index] = {
            ...nuevosDetalles[index],
            cantidad: nuevosDetalles[index].cantidad + cantidadInsumo,
          };
          return nuevosDetalles;
        } else {
          // Si no existe, lo agrega
          return [
            ...prev,
            {
              cantidad: cantidadInsumo,
              articuloInsumo: insumoSeleccionado,
              eliminado: false,
            } as DetalleArticuloManufacturado,
          ];
        }
      });
      setShowModal(false);
      setInsumoSeleccionado(null);
      setCantidadInsumo(1);
    }
  };

  // Factoriza la creación del objeto manufacturado
  const buildManufacturado = async (): Promise<ArticuloManufacturado | null> => {
    const unidadMedidaSeleccionada = unidadesMedida.find(um => um.id === Number(unidad));
    if (!unidadMedidaSeleccionada) {
      alert("Unidad de medida inválida");
      return null;
    }

    const categoriaSeleccionada = categorias.find(cat => cat.id === Number(categoria));
    if (!categoriaSeleccionada) {
      alert("Categoría inválida");
      return null;
    }

    const manufacturado = new ArticuloManufacturado();
    manufacturado.denominacion = denominacion;
    manufacturado.precioVenta = totalConGanancia;
    manufacturado.unidadMedida = { id: unidadMedidaSeleccionada.id } as UnidadMedida;
    manufacturado.categoria = { id: categoriaSeleccionada.id } as Categoria;
    manufacturado.descripcion = descripcion;
    manufacturado.tiempoEstimadoMinutos = tiempoEstimadoMinutos;
    manufacturado.preparacion = preparacion;
    manufacturado.eliminado = eliminado;

    manufacturado.detalles = detalles.map(det => ({
      id: det.id ?? undefined,
      cantidad: det.cantidad,
      articuloInsumo: det.articuloInsumo?.id
        ? { id: det.articuloInsumo.id } as ArticuloInsumo
        : undefined,
      eliminado: false,
    }));

    // 🔄 Subir imágenes nuevas a Cloudinary
    const nuevasImagenes = await Promise.all(
      imagenes.map(async (file) => {
        const url = await subirACloudinary(file);
        const imagen = new ImagenArticulo();
        imagen.denominacion = url; // Usamos URL en lugar de base64
        imagen.eliminado = false;
        return imagen;
      })
    );

    const imagenesNoEliminadas = imagenesExistentes.filter(img => !img.eliminado);

    manufacturado.imagenes = [
      ...imagenesNoEliminadas,
      ...nuevasImagenes,
    ];

    return manufacturado;
  };


const guardarOModificar = async () => {
  try {
    const manufacturado = await buildManufacturado();
    if (!manufacturado) return;
    console.log(manufacturado.detalles)
    manufacturado.precioVenta = totalConGanancia;
    manufacturado.eliminado = eliminado;
    manufacturado.tipoArticulo = TipoArticulo.ArticuloManufacturado;
    if (idFromUrl) {
      await ArticuloManufacturadoService.update(Number(idFromUrl), manufacturado);
      alert("Artículo manufacturado actualizado correctamente");
    } else {
      await ArticuloManufacturadoService.create(manufacturado);
      alert("Artículo manufacturado guardado correctamente");
    }
    limpiarFormulario();
    window.location.href = "/empleado/productos";
  } catch (error) {
    console.error(error);
    alert("Error al guardar o actualizar el artículo manufacturado");
  }
};

  return (
    <div className="formArticuloManufacturado d-flex flex-column gap-3 align-items-center">
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
        // Props de imágenes:
        imagenes={imagenes}
        imagenesExistentes={imagenesExistentes}
        handleImagenesChange={handleImagenesChange}
        eliminarImagenNueva={eliminarImagenNueva}
        eliminarImagenExistente={eliminarImagenExistente}
        showModalCategoria={showModalCategoria}
        setShowModalCategoria={setShowModalCategoria}
      />
      <Button className="agregarInsumo" variant="primary" onClick={() => setShowModal(true)}>
        Agregar Insumo
      </Button>
      <ModalAgregarInsumo
        show={showModal}
        onHide={() => setShowModal(false)}
        articulosInsumo={
          articulosInsumo.filter(
            insumo => !detalles.some(det => det.articuloInsumo?.id === insumo.id)
          )
        }
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
      <Button
        variant={idFromUrl ? "warning" : "success"}
        className="mt-3"
        onClick={guardarOModificar}
        disabled={
          !denominacion ||
          !descripcion ||
          !preparacion ||
          !categoria ||
          !unidad ||
          detalles.length === 0
        }
      >
        {idFromUrl ? "Actualizar Artículo Manufacturado" : "Guardar Artículo Manufacturado"}
      </Button>
    </div>
  );
}

export default FormArticuloManufacturado;