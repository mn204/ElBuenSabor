import CategoriaCard from '../articulos/CategoriaCard';
import FlechaDerecha from '../../assets/flecha.svg';
import FlechaIzquierda from '../../assets/flechaIzquierda.svg';
import { useEffect, useState } from 'react';
import Categoria from '../../models/Categoria';
import CategoriaService from '../../services/CategoriaService';

function Slider() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [start, setStart] = useState(0);
    const visibleCount = 5;

    // Lista de denominaciones que deben aparecer (excluyendo "Insumos")
    const denominacionesDeseadas = [
        "Gaseosas",
        "Cervezas",
        "Aguas y otros",
        "Hamburguesas",
        "Pizzas",
        "Lomos",
        "Empanadas",
        "Papas Fritas"
    ];

    useEffect(() => {
        const fetchCategoriasPorDenominacion = async () => {
            try {
                // Se obtienen las categorías para cada denominación deseada
                const promesas = denominacionesDeseadas.map(denom =>
                    CategoriaService.getByDenominacion(denom)
                );
                const resultados = await Promise.all(promesas);

                // 'resultados' es un array de arrays; se aplana para tener una sola lista
                const categoriasObtenidas = resultados.flat();

                // Filtrar categorías válidas (no null/undefined)
                const categoriasValidas = categoriasObtenidas.filter(
                    (cat): cat is Categoria => cat != null && !cat.eliminado
                );


                setCategorias(categoriasValidas);
            } catch (error) {
                console.error("Error al obtener las categorías por denominación:", error);
            }
        };

        fetchCategoriasPorDenominacion();
    }, []);
    console.log(categorias);

    const handleNext = () => {
        if (categorias) {
            setStart((prev) => (prev + 1) % categorias.length);
        }
    };

    const handlePrev = () => {
        if (categorias) {
            setStart((prev) => ((prev - 1) % categorias.length)>0 ? (prev - 1) % categorias.length : (prev) % categorias.length);
        }
    };

    // Para mostrar solo 5 categorías a la vez, con loop circular
    const visibleCategorias = [];
    for (let i = 0; i < visibleCount; i++) {
        if (categorias) {
            visibleCategorias.push(categorias[(start + i) % categorias.length]);
        }
    }

    return (
        <div className="sliderCategorias">
            <button
                className="flechaIzquierda"
                onClick={handlePrev}
                disabled={categorias.length <= visibleCount}
            >
                <img src={FlechaIzquierda} alt="Anterior" />
            </button>

            {visibleCategorias.map((cat, index) => (
                cat &&
                (
                    <CategoriaCard
                        key={cat?.id ? cat.id : `cat-${start}-${index}`}
                        categoria={cat}
                    />
                )

            ))}

            <button
                className="flechaDerecha"
                onClick={handleNext}
                disabled={categorias.length <= visibleCount}
            >
                <img src={FlechaDerecha} alt="Siguiente" />
            </button>
        </div>
    );
}

export default Slider;