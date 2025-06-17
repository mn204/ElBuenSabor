import Imagen1 from '../../assets/images/Imagen1Home.png';
import Imagen1Responsive from '../../assets/images/Image1Responsive.png';
import Imagen2Responsive from '../../assets/images/Image2Responsive.png';
import Imagen2 from '../../assets/images/Imagen2Home.png';

import '../../styles/Home.css';
import Slider from './SliderCategorias';
import CardPromocion from '../articulos/CardPromocion';
import { useEffect, useState } from 'react';
import type Promocion from '../../models/Promocion';

function Home() {
    const [promocion, setPromocion] = useState<Promocion>();
    useEffect(() => {
        const fetchPromocion = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/promocion/3");
                const promo = await response.json();
                if(promo == undefined){
                    console.log("no")
                }else{
                    setPromocion(promo);
                }
                console.log(promo)
            } catch (error) {
                console.error("Error al buscar promoción:", error);
            }
        };

        fetchPromocion();
    }, []);

    return (
        <div className="home">
            <img className='imagenHome' src={Imagen1} alt="" />
            <img className='imagenHomeResponsive' src={Imagen1Responsive} alt="" />
            <h2 className='categoriasTitle'>Categorias</h2>
            <Slider />
            {promocion && <CardPromocion promocion={promocion} />}
            <h2 className='categoriasTitle'>¡Nuestras Promos!</h2>
            <img className='imagenHome' src={Imagen2} alt="" />
            <img className='imagenHomeResponsive' src={Imagen2Responsive} alt="" />
        </div>
    );
}

export default Home;