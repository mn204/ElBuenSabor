import '../../styles/navbar.css'
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import Vector from '../../assets/Carrito.svg';
import Buscador from './Buscador';
function Navbar(){
    return(
        <>
            <nav>
                <a className='homeNav' href="/"><img className='logoEmpresa' src={IconoEmpresa} alt="Icono Empresa" /><span>El buen sabor</span></a>
                <Buscador/>
                <div className='navButtons'>
                    <button className='btnLogin'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Iniciar Secion</span>
                    </button>
                        <img className='carrito' src={Vector} alt="logoCarrito" />
                    <button
                        className="menu"
                        onClick={e => {
                            const btn = e.currentTarget;
                            btn.classList.toggle('opened');
                            btn.setAttribute('aria-expanded', btn.classList.contains('opened').toString());
                        }}
                        aria-label="Main Menu"
                        aria-expanded="false"
                    >
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                            <path className="line line2" d="M 20,50 H 80" />
                            <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                        </svg>
                    </button>
                </div>
            </nav>
        </>
    )
}

export default Navbar;