import '../../styles/navbar.css'
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import Vector from '../../assets/Carrito.svg';
import Buscador from './Buscador';
import  { useState } from 'react';
import {Dropdown, Modal } from 'react-bootstrap';
import LoginUsuario from '../auth/LoginUsuario.tsx';
import { Link, useNavigate } from 'react-router-dom';
import RegisterCliente from '../auth/RegisterCliente.tsx';
import {useAuth} from "../../context/AuthContext.tsx";

function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true); // nuevo estado
    const [busqueda, setBusqueda] = useState(""); // Estado para el input del buscador
    const navigate = useNavigate(); // <--- Agrega esto
    const { isAuthenticated, getUserDisplayName, logout, usuario } = useAuth();

    const handleOpenLogin = () => {
        setIsLoginView(true);
        setShowModal(true);
    };
    const handleOpenRegister = () => {
        setIsLoginView(false);
        setShowModal(true);
    };


    const handleClose = () => setShowModal(false);

    function handleBuscar(nuevaBusqueda: string) {
        if (nuevaBusqueda.trim() !== "") {
            navigate(`/busqueda?q=${encodeURIComponent(nuevaBusqueda)}`);
            setBusqueda(""); // Limpiar el input después de buscar
        }
    }
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };


    return (
        <>
            <nav
                style={
                    isAuthenticated && usuario?.rol !== "CLIENTE"
                        ? { backgroundColor: "#000" }
                        : {}
                }
            >
                <Link className="homeNav" to="/">
                    <img className="logoEmpresa" src={IconoEmpresa} alt="Icono Empresa" />
                    <span>EL BUEN SABOR</span>
                </Link>

                {(!isAuthenticated || usuario?.rol === "CLIENTE") && (
                    <Buscador
                        onBuscar={handleBuscar}
                        valorInicial={busqueda}
                        setValor={setBusqueda}
                    />
                )}

                <div className="navButtons">
                    {isAuthenticated ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-user">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                    <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="ms-2">{getUserDisplayName()}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Header>
                                    {usuario?.rol && usuario?.rol !== "CLIENTE" && (
                                        <small className="text-muted">Rol: {usuario.rol}</small>
                                    )}
                                </Dropdown.Header>
                                <Dropdown.Item as={Link} to="/perfil">
                                    Mi Perfil
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>
                                    Cerrar Sesión
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <button className="btnLogin" onClick={handleOpenLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Iniciar Sesión</span>
                        </button>
                    )}

                    {(!isAuthenticated || usuario?.rol === "CLIENTE") && (
                        <Link to="/carrito" className="btnCarrito">
                            <img className="carrito" src={Vector} alt="logoCarrito" />
                        </Link>
                    )}
                </div>
            </nav>



            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="modal-header-custom">
                    <img className='logoEmpresa' src={IconoEmpresa} alt="Icono Empresa" />
                    <Modal.Title className="modal-title-custom">{isLoginView ? 'EL BUEN SABOR' : 'EL BUEN SABOR'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoginView ? (
                        <LoginUsuario
                            onRegisterClick={handleOpenRegister}
                            onClose={handleClose}
                        />
                    ) : (
                        <RegisterCliente onBackToLogin={handleOpenLogin} />
                    )}
                </Modal.Body>

            </Modal>
        </>
    );
}

export default Navbar;