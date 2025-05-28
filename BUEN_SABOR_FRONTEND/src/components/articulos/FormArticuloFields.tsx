import Categoria from "../../models/Categoria";
import UnidadMedida from "../../models/UnidadMedida";

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

}

function FormArticuloFields({
  denominacion, setDenominacion,
  descripcion, setDescripcion,
  tiempoEstimadoMinutos, setTiempoEstimadoMinutos,
  preparacion, setPreparacion,
  categoria, setCategoria,
  categorias, unidad, unidadesMedida, setUnidad
}: Props) {
  return (
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
          <select
              value={unidad} onChange={(e) => setUnidad(e.target.value)}>
              <option value="">Seleccione unidad</option>
              {unidadesMedida.map((um) => (
                  <option key={um.id} value={um.id}>
                      {um.denominacion}
                  </option>
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
  );
}

export default FormArticuloFields;