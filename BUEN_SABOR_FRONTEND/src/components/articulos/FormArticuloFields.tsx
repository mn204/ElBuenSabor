import React from "react";
import Categoria from "../../models/Categoria";
import UnidadMedida from "../../models/UnidadMedida";
import ImagenArticuloManufacturado from "../../models/ImagenArticuloManufacturado";

interface Props {
  denominacion: string;
  setDenominacion: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  tiempoEstimadoMinutos: number;
  setTiempoEstimadoMinutos: (v: number) => void;
  preparacion: string;
  setPreparacion: (v: string) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  categorias: Categoria[];
  unidad: string;
  setUnidad: (v: string) => void;
  unidadesMedida: UnidadMedida[];
  // Imágenes
  imagenes: File[];
  imagenesExistentes: ImagenArticuloManufacturado[];
  handleImagenesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  eliminarImagenNueva: (idx: number) => void;
  eliminarImagenExistente: (idx: number) => void;
}

const FormArticuloFields: React.FC<Props> = ({
  denominacion,
  setDenominacion,
  descripcion,
  setDescripcion,
  tiempoEstimadoMinutos,
  setTiempoEstimadoMinutos,
  preparacion,
  setPreparacion,
  categoria,
  setCategoria,
  categorias,
  unidad,
  setUnidad,
  unidadesMedida,
  imagenes,
  imagenesExistentes,
  handleImagenesChange,
  eliminarImagenNueva,
  eliminarImagenExistente,
}) => (
  <form className="d-flex flex-column gap-3 text-start" onSubmit={e => e.preventDefault()}>
    <div>
      <label>Denominación:</label>
      <input
        type="text"
        value={denominacion}
        onChange={e => setDenominacion(e.target.value)}
        className="form-control"
        required
      />
    </div>
    <div>
      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        className="form-control"
        required
      />
    </div>
    <div>
      <label>Tiempo estimado (minutos):</label>
      <input
        type="number"
        min={0}
        value={tiempoEstimadoMinutos}
        onChange={e => setTiempoEstimadoMinutos(Number(e.target.value))}
        className="form-control"
        required
      />
    </div>
    <div>
      <label>Preparación:</label>
      <textarea
        value={preparacion}
        onChange={e => setPreparacion(e.target.value)}
        className="form-control"
        required
      />
    </div>
    <div>
      <label>Categoría:</label>
      <select
        value={categoria}
        onChange={e => setCategoria(e.target.value)}
        className="form-select"
        required
      >
        <option value="">Seleccione una categoría</option>
        {categorias.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.denominacion}</option>
        ))}
      </select>
    </div>
    <div>
      <label>Unidad de medida:</label>
      <select
        value={unidad}
        onChange={e => setUnidad(e.target.value)}
        className="form-select"
        required
      >
        <option value="">Seleccione una unidad</option>
        {unidadesMedida.map(um => (
          <option key={um.id} value={um.id}>{um.denominacion}</option>
        ))}
      </select>
    </div>
    {/* Imágenes */}
    <div>
      <label>Imágenes:</label>
      {/* Imágenes existentes */}
      {imagenesExistentes.length > 0 && (
        <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
          {imagenesExistentes.map((img, idx) =>
            !img.eliminado && (
              <div key={img.id || idx} style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={img.denominacion}
                  alt={`img-existente-${idx}`}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={() => eliminarImagenExistente(idx)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            )
          )}
        </div>
      )}
      {/* Imágenes nuevas */}
      <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
        {imagenes.map((img, idx) => (
          <div key={idx} style={{ position: "relative", display: "inline-block" }}>
            <img
              src={URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => eliminarImagenNueva(idx)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImagenesChange}
      />
    </div>
  </form>
);

export default FormArticuloFields;