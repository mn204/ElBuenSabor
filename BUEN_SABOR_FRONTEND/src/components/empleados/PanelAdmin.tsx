import { Container, Row, Col, Nav } from 'react-bootstrap';
import '../../styles/panelAdmin.css';

import Computadora from '../../assets/svgAdmin/computadora.svg';
import Dashboard from '../../assets/svgAdmin/dashboard.svg';
import Pedidos from '../../assets/svgAdmin/pedidos.svg';
import Cocina from '../../assets/svgAdmin/cocina.svg';
import Delivery from '../../assets/svgAdmin/delivery.svg';
import Facturacion from '../../assets/svgAdmin/facturacion.svg';
import Productos from '../../assets/svgAdmin/productos.svg';
import Estadisticas from '../../assets/svgAdmin/estadisticas.svg';
import Usuario from '../../assets/svgAdmin/usuario-black.svg';
import GrillaArticuloManufacturado from "../articulos/GrillaArticuloManufacturado.tsx";
import GrillaCliente from "./GrillaCliente.tsx";
import GrillaEmpleado from "./GrillaEmpleado.tsx";
import {useAuth} from "../../context/AuthContext.tsx"

import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";

function PanelAdmin() {

    const{ usuario, user, empleado} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();


    const botones = [
        { nombre: 'Dashboard', icono: Dashboard, path: 'dashboard', rolesPermitidos: ['ADMINISTRADOR'] },
        { nombre: 'Pedidos', icono: Pedidos, path: 'pedidos', rolesPermitidos: ['ADMINISTRADOR', 'CAJERO'] },
        { nombre: 'Cocina', icono: Cocina, path: 'cocina', rolesPermitidos: ['ADMINISTRADOR', 'CAJERO', 'COCINERO'] },
        { nombre: 'Delivery', icono: Delivery, path: 'delivery', rolesPermitidos: ['ADMINISTRADOR', 'DELIVERY'] },
        { nombre: 'Facturación', icono: Facturacion, path: 'facturacion', rolesPermitidos: ['ADMINISTRADOR', 'CAJERO'] },
        { nombre: 'Clientes', icono: Usuario, path: 'clientes', rolesPermitidos: ['ADMINISTRADOR'] },
        { nombre: 'Productos', icono: Productos, path: 'productos', rolesPermitidos: ['ADMINISTRADOR'] },
        { nombre: 'Categorias', icono: Productos, path: 'categorias', rolesPermitidos: ['ADMINISTRADOR'] },
        { nombre: 'Estadísticas', icono: Estadisticas, path: 'estadisticas', rolesPermitidos: ['ADMINISTRADOR'] },
        { nombre: 'Empleados', icono: Usuario, path: 'empleados', rolesPermitidos: ['ADMINISTRADOR'] },
    ];

    const botonesVisibles = botones.filter(btn =>
        btn.rolesPermitidos.includes(usuario?.rol)
    );

    // Obtener la ruta activa desde la URL (ej: 'cocina')
    const rutaActual = location.pathname.split("/")[2] || "dashboard";
    const botonActual = botones.find(btn => btn.path === rutaActual);

    const renderContent = () => {
        if (!botonActual || !botonActual.rolesPermitidos.includes(usuario?.rol)) {
            return <div>No tenés permiso para ver esta sección.</div>;
        }

        switch (botonActual.nombre) {
            case 'Productos':
                return <GrillaArticuloManufacturado />;
            case 'Clientes':
                return <GrillaCliente />;
            case 'Pedidos':
                return <div>Componente Pedidos</div>;
            case 'Cocina':
                return <div>Componente Cocina</div>;
            case 'Delivery':
                return <div>Componente Delivery</div>;
            case 'Facturación':
                return <div>Componente Facturación</div>;
            case 'Estadísticas':
                return <div>Componente Estadísticas</div>;
            case 'Empleados':
                return <GrillaEmpleado />;
            case 'Categorias':
                return <div>Componente Categorias</div>;
            default:
                return <div>Bienvenido al panel de administración</div>;
        }
    };
    return (
        <Container fluid className="panel-admin-container p-0">
            <Row className="g-0">
                {/* Sidebar */}
                <Col md={2} className="sidebar d-none d-md-flex flex-column p-3" style={{ backgroundColor: '#F0F0F0', minHeight: '100vh' }}>
                    <div className="mb-4 text-center">
                        <img src={Computadora} alt="Icono Computadora" style={{ height: 40, width: 40 }} />
                        <h6 className="mt-2 mb-0">Panel de Administración</h6>
                        <small>El Buen Sabor</small>
                    </div>

                    <Nav className="flex-column">
                        {botonesVisibles.map((btn) => (
                            <Nav.Link
                                key={btn.nombre}
                                onClick={() => navigate(`/empleado/${btn.path}`)}
                                className={`d-flex align-items-center mb-2 ${rutaActual === btn.path ? 'fw-bold active' : ''}`}
                                style={{
                                    cursor: 'pointer',
                                    color: '#000',
                                    backgroundColor: rutaActual === btn.path ? '#e0e0e0' : 'transparent',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                }}
                            >
                                <img src={btn.icono} alt={`Icono ${btn.nombre}`} style={{ width: 20, height: 20, marginRight: 10 }} />
                                {btn.nombre}
                            </Nav.Link>
                        ))}
                    </Nav>

                </Col>

                {/* Main content */}
                <Col md={10} className="p-4">
                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
}

export default PanelAdmin;
