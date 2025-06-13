import { Container, Row, Col, Nav } from 'react-bootstrap';
import { useEffect, useState } from "react";
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
import { useAuth } from "../../context/AuthContext.tsx"
import { useSucursal } from "../../context/SucursalContextEmpleado.tsx";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import ArticuloInsumo from "../../models/ArticuloInsumo";

import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import GrillaCategorias from '../articulos/GrillaCategorias.tsx';

function PanelAdmin() {

    const { usuario, user, empleado } = useAuth();
    const { sucursalActual } = useSucursal();
    const location = useLocation();
    const navigate = useNavigate();

    const [stockBajo, setStockBajo] = useState<ArticuloInsumo[]>([]);

    useEffect(() => {
        const fetchStockBajo = async () => {
            if (!sucursalActual) return;
            try {
                const data = await ArticuloInsumoService.obtenerArticulosConStockBajo(sucursalActual.id!);
                setStockBajo(data);
            } catch (error) {
                console.error("Error al obtener insumos con stock bajo", error);
            }
        };

        fetchStockBajo();
        const interval = setInterval(fetchStockBajo, 60000); // cada 1 min
        return () => clearInterval(interval);
    }, [sucursalActual]);


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

        const requiereContextoSucursal = !['clientes', 'empleados'].includes(botonActual.path);

        if (requiereContextoSucursal && !sucursalActual) {
            return (
                <div className="text-center p-4">
                    <p>Cargando información de la sucursal...</p>
                </div>
            );
        }

        switch (botonActual.nombre) {
            case 'Dashboard':
                return (
                    <div>
                        <h4>Dashboard - {sucursalActual?.nombre}</h4>
                        <p>Bienvenido al panel de administración</p>
                        {sucursalActual && (
                            <div className="mt-3 mb-4">
                                <strong>Sucursal Actual:</strong> {sucursalActual.nombre}<br />
                                <strong>Horario:</strong> {sucursalActual.horarioApertura} - {sucursalActual.horarioCierre}<br />
                                <strong>Dirección:</strong> {sucursalActual.domicilio?.calle} {sucursalActual.domicilio?.numero}
                            </div>
                        )}

                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <button className="dashboard-button" onClick={() => navigate('/empleado/clientes')}>Gestionar Clientes</button>
                            <button className="dashboard-button" onClick={() => navigate('/empleado/empleados')}>Gestionar Empleados</button>
                            <button className="dashboard-button" onClick={() => navigate('/empleado/promociones')}>Gestionar Promociones</button>
                        </div>

                        <h5 className="mt-4">Notificaciones de Stock</h5>
                        <table className="table table-bordered mt-2">
                            <thead className="table-light">
                                <tr>
                                    <th>Insumo</th>
                                    <th>Stock Actual</th>
                                    <th>Stock Mínimo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockBajo.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center">No hay alertas de stock.</td>
                                    </tr>
                                ) : (
                                    stockBajo.map((n, i) => (
                                        <tr key={i}>
                                            <td>{n.denominacion}</td>
                                            <td>{n.sucursalInsumo?.stockActual}</td>
                                            <td>{n.sucursalInsumo?.stockMinimo}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                );

            case 'Productos':
                return (
                    <div>
                        <h4>Productos - {sucursalActual?.nombre}</h4>
                        <GrillaArticuloManufacturado />
                    </div>
                );
            case 'Clientes':
                return (
                    <div>
                        <GrillaCliente />
                    </div>
                );
            case 'Pedidos':
                return (
                    <div>
                        <h4>Pedidos - {sucursalActual?.nombre}</h4>
                        <p>Componente Pedidos para la sucursal {sucursalActual?.nombre}</p>
                    </div>
                );
            case 'Cocina':
                return (
                    <div>
                        <h4>Cocina - {sucursalActual?.nombre}</h4>
                        <p>Componente Cocina para la sucursal {sucursalActual?.nombre}</p>
                    </div>
                );
            case 'Delivery':
                return (
                    <div>
                        <h4>Delivery - {sucursalActual?.nombre}</h4>
                        <p>Componente Delivery para la sucursal {sucursalActual?.nombre}</p>
                    </div>
                );
            case 'Facturación':
                return (
                    <div>
                        <h4>Facturación - {sucursalActual?.nombre}</h4>
                        <p>Componente Facturación para la sucursal {sucursalActual?.nombre}</p>
                    </div>
                );
            case 'Estadísticas':
                return (
                    <div>
                        <h4>Estadísticas - {sucursalActual?.nombre}</h4>
                        <p>Componente Estadísticas para la sucursal {sucursalActual?.nombre}</p>
                    </div>
                );
            case 'Empleados':
                return (
                    <div>
                        <GrillaEmpleado />
                    </div>
                );
            case 'Categorias':
                return (
                    <div>
                        <GrillaCategorias/>
                    </div>
                );
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
                        {sucursalActual && usuario?.rol !== 'ADMINISTRADOR' && (
                            <div className="mt-2">
                                <small className="text-muted">
                                    <strong>{sucursalActual.nombre}</strong>
                                </small>
                            </div>
                        )}
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
