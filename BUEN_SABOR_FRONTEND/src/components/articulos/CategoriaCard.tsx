import type Categoria from "../../models/Categoria";

function CategoriaCard({ categoria }: { categoria: Categoria }) {
  return (
    <div className="categoriaCard flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
      <img
        src={categoria.urlImagen}
        alt={categoria.denominacion}
        className="w-32 h-32 object-cover mb-4 rounded-full"
      />
      <h2 className="text-xl">{categoria.denominacion}</h2>
    </div>
  );
}

export default CategoriaCard;
