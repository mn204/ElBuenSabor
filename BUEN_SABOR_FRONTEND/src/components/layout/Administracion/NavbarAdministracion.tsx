import Usuario from '../../../assets/svgAdmin/usuario.svg';
import Computadora from '../../../assets/svgAdmin/computadora.svg';
import Dashboard from '../../../assets/svgAdmin/dashboard.svg';
import Pedidos from '../../../assets/svgAdmin/pedidos.svg';
import Cocina from '../../../assets/svgAdmin/cocina.svg';
import Delivery from '../../../assets/svgAdmin/delivery.svg';
import Facturacion from '../../../assets/svgAdmin/facturacion.svg';
import Productos from '../../../assets/svgAdmin/productos.svg';
import Estadisticas from '../../../assets/svgAdmin/estadisticas.svg';
import Configuracion from '../../../assets/svgAdmin/configuracion.svg';
import CerrarSesion from '../../../assets/svgAdmin/cerrar-sesion.svg';
import '../../../styles/navbarAdministracion.css';


function NavbarAdministracion() {
return(
<>
        <nav className="navbar navbar-admin px-4">
            <div className="d-flex align-items-center">
                <img
                    src={Usuario}
                    alt="Usuario"
                    className="me-2"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />

                {/*Informacion del Empleado*/}
                <div className="text-white">
                    <h5 className="mb-0">Nombre Usuario</h5>
                    <h6 className="mb-0">Rol</h6>
                </div>
            </div>
        </nav>

        <nav className="panel-sec-blk p-3 d-none d-md-block" style={{ width: "250px" }}>
            <div>
                <img src={Computadora} alt="Icono Computadora" style={{height: 40, width: 40}}/>
                <h5 className="mb-0">Panel de Administración</h5>
                <h6 className="">El Buen Sabor</h6>


                {/*Botones*/}
            </div>
            <ul className="nav flex-column mt-4">
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Dashboard} alt="Icono Dashboard" className='svg-admin'/>
                        Dashboard</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Pedidos} alt="Icono Pedidos" className='svg-admin'/>
                        Pedidos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Cocina} alt="Icono Cocina" className='svg-admin'/>
                        Cocina</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Delivery} alt="Icono Delivery" className='svg-admin'/>
                        Delivery</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Facturacion} alt="Icono Facruración" className='svg-admin'/>
                        Facturación</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Productos} alt="Icono Productos" className='svg-admin'/>
                        Productos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Estadisticas} alt="Icono Estadísticas" className='svg-admin'/>
                        Estadísticas</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-muted panel-sec-btn" href="#">
                        <img src={Configuracion} alt="Icono Configuración" className='svg-admin'/>
                        Configuración</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link fw-bold text-danger panel-sec-btn-session" href="#">
                        <img src={CerrarSesion} alt="Icono Cerrar Sesión" className='svg-admin'/>
                        Cerrar Sesión</a>
                </li>
            </ul>
        </nav>
        </>
    );
}
export default NavbarAdministracion;