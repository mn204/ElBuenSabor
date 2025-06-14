import '../../styles/navbar.css'
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import Vector from '../../assets/Carrito.svg';
import Buscador from './Buscador';
import { useState } from 'react';
import { Dropdown, Modal, Form } from 'react-bootstrap'; // <- Agregado Form aquí
import LoginUsuario from '../auth/LoginUsuario.tsx';
import { Link, useNavigate } from 'react-router-dom';
import RegisterCliente from '../auth/RegisterCliente.tsx';
import { useAuth } from "../../context/AuthContext.tsx";
import { useSucursal } from "../../context/SucursalContextEmpleado.tsx";
import { useSucursalUsuario } from '../../context/SucursalContext.tsx';

function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated, getUserDisplayName, logout, usuario, user, empleado } = useAuth();
    const { sucursalActual, sucursales, cambiarSucursal, esModoTodasSucursales } = useSucursal();
    const { sucursalActualUsuario, sucursalesUsuario, cambiarSucursalUsuario } = useSucursalUsuario();

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
            setBusqueda("");
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleCambiarSucursal = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const valor = event.target.value;

        if (valor === "todas") {
            cambiarSucursal(null); // Modo "Todas las sucursales"
        } else {
            const sucursalId = parseInt(valor);
            const sucursalSeleccionada = sucursales.find(s => s.id === sucursalId);
            if (sucursalSeleccionada) {
                cambiarSucursal(sucursalSeleccionada);
            }
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
                <div className="navContainer">
                    <div className="navLeft">
                        <Link className="homeNav" to="/">
                            <img className="logoEmpresa" src={IconoEmpresa} alt="Icono Empresa" />
                            <span>EL BUEN SABOR</span>
                        </Link>
                    </div>
                    <div className="sucursal text-white d-flex align-items-center">
                        <label htmlFor="selectSucursalUsuario" className="me-2">Sucursal:</label>
                        <Form.Select
                            id="selectSucursalUsuario"
                            value={sucursalActualUsuario?.id || ""}
                            onChange={(e) => {
                                const id = parseInt(e.target.value);
                                const sucursal = sucursalesUsuario.find(s => s.id === id);
                                if (sucursal) cambiarSucursalUsuario(sucursal);
                            }}
                            style={{ width: 'auto', minWidth: '200px' }}
                        >
                            {sucursalesUsuario.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="navCenter">
                        {(!isAuthenticated || usuario?.rol === "CLIENTE") ? (
                            <Buscador
                                onBuscar={handleBuscar}
                                valorInicial={busqueda}
                                setValor={setBusqueda}
                            />
                        ) : (
                            <>
                                {usuario?.rol === "ADMINISTRADOR" ? (
                                    // Select para administradores
                                    <div className="d-flex align-items-center">
                                        <label htmlFor="sucursal-select" className="me-2 text-white">
                                            Sucursal:
                                        </label>
                                        <Form.Select
                                            id="sucursal-select"
                                            value={esModoTodasSucursales ? "todas" : (sucursalActual?.id || "")}
                                            onChange={handleCambiarSucursal}
                                            style={{ width: 'auto', minWidth: '200px' }}
                                        >
                                            <option value="todas">Todas las sucursales</option>
                                            {sucursales.map(sucursal => (
                                                <option key={sucursal.id} value={sucursal.id}>
                                                    {sucursal.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>

                                    </div>
                                ) : (
                                    // Mostrar sucursal fija para empleados regulares
                                    empleado?.sucursal?.nombre && (
                                        <span className="homeNav text-white">
                                            Sucursal: {empleado.sucursal.nombre}
                                        </span>
                                    )
                                )}
                            </>
                        )}
                    </div>

                    <div className="navRight navButtons">
                        {isAuthenticated ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-user" className="userDropdown">
                                    {usuario?.providerId === "google.com" ? (
                                        <img
                                            src={user?.photoURL || IconoEmpresa}
                                            width="30"
                                            height="30"
                                            className="rounded-circle"
                                            alt="Foto de perfil de Google"
                                        />
                                    ) : usuario?.photoUrl ? (
                                        <img
                                            src={usuario.photoUrl}
                                            width="30"
                                            height="30"
                                            className="rounded-circle"
                                            alt="Foto de perfil del usuario"
                                        />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 20" fill="none">
                                            <path
                                                d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z"
                                                stroke="black"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                    <span className="ms-2">{getUserDisplayName()}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Header>
                                        {usuario?.rol && usuario?.rol !== "CLIENTE" && (
                                            <small className="text-muted">Rol: {usuario.rol}</small>
                                        )}
                                    </Dropdown.Header>
                                    <Dropdown.Item as={Link} to="/perfil">Mi Perfil</Dropdown.Item>
                                    <Dropdown.Divider />
                                    {usuario?.rol === "CLIENTE" && (
                                        <>
                                            <Dropdown.Item as={Link} to="/domicilios">Mis Domicilios</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as={Link} to="/pedidos">Mis Pedidos</Dropdown.Item>
                                            <Dropdown.Divider />
                                        </>
                                    )}
                                    <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
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