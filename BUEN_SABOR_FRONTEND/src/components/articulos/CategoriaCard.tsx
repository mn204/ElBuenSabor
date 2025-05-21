function CategoriaCard({ categoria }: { categoria: any }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
      <img
        src={categoria.imagen}
        alt={categoria.nombre}
        className="w-32 h-32 object-cover mb-4 rounded-full"
      />
      <h2 className="text-xl font-semibold">{categoria.nombre}</h2>
    </div>
  );
}