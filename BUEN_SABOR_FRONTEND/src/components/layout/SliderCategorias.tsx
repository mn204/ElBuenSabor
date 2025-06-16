import CategoriaCard from '../articulos/CategoriaCard';
import Ham from '../../assets/images/hamburguesa.png';
import FlechaDerecha from '../../assets/flecha.svg';
import FlechaIzquierda from '../../assets/flechaIzquierda.svg';
import { useEffect, useState } from 'react';
import Categoria from '../../models/Categoria';
import CategoriaService from '../../services/CategoriaService';

function Slider(){
    const [ categorias, setCategorias ] = useState<Categoria[]>();
    const [start, setStart] = useState(0);
    const visibleCount = 5;

    useEffect(()=>{
        CategoriaService.getAll().then((cats)=>setCategorias(cats))
        console.log(categorias)
    },[]);

    const handleNext = () => {
        if(categorias){
            setStart((prev) => (prev + 1) % categorias.length);
        }
    };

    const handlePrev = () => {
        if(categorias){
            setStart((prev) => (prev - 1) % categorias.length);
        }
    };

    // Para mostrar solo 5 categorías a la vez, con loop circular
    const visibleCategorias = [];
    for (let i = 0; i < visibleCount; i++) {
        if(categorias){
            visibleCategorias.push(categorias[(start + i) % categorias.length]);
        }
    }
    return(
        <>
            <div className="sliderCategorias">
                <button
                    className="flechaIzquierda"
                    onClick={handlePrev}
                    disabled={start === 0}
                >
                    <img src={FlechaIzquierda} alt="Siguiente" />
                </button>
                {visibleCategorias.map((cat) => (
                    <CategoriaCard categoria={cat}/>
                ))}
                <button className='flechaDerecha' onClick={handleNext}>
                    <img src={FlechaDerecha} alt="Siguiente" />
                </button>
            </div>
        </>
    )
}

export default Slider;