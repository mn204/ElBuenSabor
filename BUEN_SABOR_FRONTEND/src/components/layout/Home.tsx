import Imagen1 from '../../assets/images/Imagen1Home.png';
import Imagen1Responsive from '../../assets/images/Image1Responsive.png';
import Imagen2Responsive from '../../assets/images/Image2Responsive.png';
import Imagen2 from '../../assets/images/Imagen2Home.png';
import Ham from '../../assets/images/hamburguesa.png';
import Flecha from '../../assets/flecha.svg';
import '../../styles/Home.css';
function Home(){
    return(
        <div className="home">
            <img className='imagenHome' src={Imagen1} alt="" />
            <img className='imagenHomeResponsive' src={Imagen1Responsive} alt="" />
            <h2 className='categoriasTitle'>Categorias</h2>
            <div className="sliderCategorias">
                <div className="categoriaCard">
                    <img src={Ham} alt="" />
                    <p>Hamburguesa</p>
                </div>
                <div className="categoriaCard">
                    <img src={Ham} alt="" />
                    <p>Hamburguesa</p>
                </div>
                <div className="categoriaCard">
                    <img src={Ham} alt="" />
                    <p>Hamburguesa</p>
                </div>
                <div className="categoriaCard">
                    <img src={Ham} alt="" />
                    <p>Hamburguesa</p>
                </div>
                <div className="categoriaCard">
                    <img src={Ham} alt="" />
                    <p>Hamburguesa</p>
                </div>
                <button className='flechaIzquierda'>
                    <img src={Flecha} alt="" />
                </button>
            </div>
            <h2 className='categoriasTitle'>¡Nuestras Promos!</h2>
            <img className='imagenHome' src={Imagen2} alt="" />
            <img className='imagenHomeResponsive' src={Imagen2Responsive} alt="" />
        </div>
    )
}

export default Home;