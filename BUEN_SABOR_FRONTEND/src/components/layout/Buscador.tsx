import { useState, useEffect } from 'react';
import '../../styles/buscador.css';
import Ham from '../../assets/images/hamburguesa.png';


type BuscadorProps = {
  onBuscar: (valor: string) => void;
  valorInicial?: string;
  setValor?: (valor: string) => void; // <-- Agrega esta línea
};
function Buscador({ onBuscar, valorInicial = "", setValor }: BuscadorProps) {
  const [query, setQuery] = useState(valorInicial);
  const [results, setResults] = useState<any[]>([]);

  // Maneja el cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (setValor) setValor(e.target.value); // <-- Llama a setValor si existe
  };

  // Maneja el submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onBuscar(query.trim());
      setQuery(""); // Limpia el input local
      if (setValor) setValor(""); // Limpia el input en el padre
    }
  };

  // Consulta la API cuando cambia el query (solo para mostrar sugerencias)
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/productos/buscar/denominacion?denominacion=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      }
    };

    fetchData();
    setResults([]); // Limpia los resultados
  }, [query]);

  return (
    <section className="buscador d-flex flex-column">
      <form className="search-bar" style={{ borderRadius: results.length === 0 ? '30px' : '30px 30px 0 0' }} onSubmit={handleSubmit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-search"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          value={query}
          onChange={handleInputChange}
        />
      </form>
      <div className="search-results position-absolute overflow-hidden p-10 d-flex align-items-start justify-content-center flex-column" style={{ padding: results.length === 0 ? '0' : '15px' }}>
        {results.length > 0 && (
          <ul className='listaProductoBuscado overflow-hidde list-unstyled d-flex flex-column gap-2 w-100'>
            {results.slice(0, 3).map((producto: any) => (
              <li key={producto.id}>
                <a className='linkProductoBsucado text-black d-flex text-start' href="#">
                  <img className='imgProductoBuscado' src={Ham} alt={producto.denominacion} />
                  <div className='d-flex flex-column'>
                    <span>{producto.denominacion}</span>
                    <span className='precioProductoBuscado'>${producto.precioVenta}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Buscador;