import '../../styles/navbar.css'
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import Vector from '../../assets/Carrito.svg';
import Buscador from './Buscador';
import  { useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginUsuario from '../auth/LoginUsuario.tsx'; // asegúrate que la ruta sea correcta

function Navbar() {
    const [showLogin, setShowLogin] = useState(false);

    const handleOpen = () => setShowLogin(true);
    const handleClose = () => setShowLogin(false);

    return (
        <>
            <nav>
                <a className='homeNav' href="/"><img className='logoEmpresa' src={IconoEmpresa} alt="Icono Empresa" /><span>EL BUEN SABOR</span></a>
                <Buscador />
                <div className="navButtons">
                    <button className='btnLogin' onClick={handleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                            <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Iniciar Sesión</span>
                    </button>
                    <img className='carrito' src={Vector} alt="logoCarrito" />
                </div>
            </nav>

            <Modal show={showLogin} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Iniciar Sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginUsuario />
                </Modal.Body>
                {/* Opcional: con Footer
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
                */}
            </Modal>
        </>
    );
}

export default Navbar;