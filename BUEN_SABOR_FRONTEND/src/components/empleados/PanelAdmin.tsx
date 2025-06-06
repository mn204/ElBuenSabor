import { useState } from 'react';
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

function PanelAdmin() {
    const [selected, setSelected] = useState('Dashboard');

    const renderContent = () => {
        switch (selected) {
            case 'Productos':
                return <GrillaArticuloManufacturado/>;
            case 'Clientes':
                return <div>Componente Clientes</div>;
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
                return <div>Componente Empleados</div>;
            case 'Categorias':
                return <div>Componente Categorias</div>;
            default:
                return <div>Bienvenido al panel de administración</div>;
        }
    };

    const botones = [
        { nombre: 'Dashboard', icono: Dashboard },
        { nombre: 'Pedidos', icono: Pedidos },
        { nombre: 'Cocina', icono: Cocina },
        { nombre: 'Delivery', icono: Delivery },
        { nombre: 'Facturación', icono: Facturacion },
        { nombre: 'Clientes', icono: Usuario },
        { nombre: 'Productos', icono: Productos },
        { nombre: 'Categorias', icono: Productos },
        { nombre: 'Estadísticas', icono: Estadisticas },
        { nombre: 'Empleados', icono: Usuario },
    ];

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
                        {botones.map((btn) => (
                            <Nav.Link
                                key={btn.nombre}
                                onClick={() => setSelected(btn.nombre)}
                                className={`d-flex align-items-center mb-2 ${selected === btn.nombre ? 'fw-bold active' : ''}`}
                                style={{
                                    cursor: 'pointer',
                                    color: '#000',
                                    backgroundColor: selected === btn.nombre ? '#e0e0e0' : 'transparent',
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
