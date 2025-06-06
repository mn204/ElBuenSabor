import './App.css'
import IconoEmpresa from './assets/IconoEmpresa.jpg';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './components/layout/Home'
import Perfil from './components/auth/Perfil'
import FormArticuloManufacturado from './components/articulos/FormArticuloManufacturado'
import GrillaArticuloManufacturado from './components/articulos/GrillaArticuloManufacturado'
import GrillaCategorias from './components/articulos/GrillaCategorias'
import GrillaInsumos from './components/articulos/GrillaInsumos'
import GrillaUnidadMedida from "./components/articulos/GrillaUnidadMedida";
import GrillaImagenArticulo from "./components/articulos/GrillaImagenArticulo";
import GrillaHistoricoCompra from "./components/articulos/GrillaHistoricoCompra";
import GrillaHistoricoVenta from "./components/articulos/GrillaHistoricoVenta";
import FormCategoria from './components/articulos/FormCategoria'
import RegisterEmpleado from "./components/auth/RegisterEmpleado.tsx";
import { Carrito } from './components/articulos/Carrito.tsx'
import Busqueda from './components/articulos/Busqueda.tsx'
import VistaArticulo from './components/articulos/VistaArticulo.tsx'
import FormInsumos from './components/articulos/FormInsumos.tsx'
import {AuthProvider, useAuth} from './context/AuthContext.tsx'
import ProtectedRoute from './context/ProtectedRoute.tsx'
import Rol from './models/enums/Rol.ts'
import {Modal} from "react-bootstrap";
import RegisterGoogle from "./components/auth/RegisterGoogle.tsx";

function AppContent() {
  const { requiresGoogleRegistration, completeGoogleRegistration } = useAuth();

  const handleGoogleRegistrationFinish = () => {
    completeGoogleRegistration();
  };

  return (
      <>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/articulo/:id" element={<VistaArticulo />} />

          {/* Rutas para clientes autenticados */}
          <Route path="/perfil" element={
            <ProtectedRoute requiredRoles={[Rol.CLIENTE, Rol.ADMIN, Rol.CAJERO, Rol.COCINERO, Rol.DELIVERY]}>
              <Perfil />
            </ProtectedRoute>
          } />

          <Route path="/carrito" element={<Carrito />} />

          {/* Rutas para empleados y administradores */}
          <Route path="/manufacturado" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN, Rol.COCINERO]}>
              <FormArticuloManufacturado />
            </ProtectedRoute>
          } />

          <Route path="/manufacturados" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN, Rol.COCINERO]}>
              <GrillaArticuloManufacturado />
            </ProtectedRoute>
          } />

          <Route path="/categorias" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN]}>
              <GrillaCategorias />
            </ProtectedRoute>
          } />

          <Route path="/articulos" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN, Rol.COCINERO]}>
              <GrillaInsumos />
            </ProtectedRoute>
          } />

          <Route path="/unidades" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN]}>
              <GrillaUnidadMedida />
            </ProtectedRoute>
          } />

          <Route path="/imagenes" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN]}>
              <GrillaImagenArticulo />
            </ProtectedRoute>
          } />

          <Route path="/historicocompra" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN, Rol.CAJERO]}>
              <GrillaHistoricoCompra />
            </ProtectedRoute>
          } />

          <Route path="/historicoventa" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN, Rol.CAJERO]}>
              <GrillaHistoricoVenta />
            </ProtectedRoute>
          } />

          <Route path="/categoria" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN]}>
              <FormInsumos />
            </ProtectedRoute>
          } />

          <Route path="/admin/nuevo-empleado/" element={
            <ProtectedRoute requiredRoles={[Rol.ADMIN]}>
              <RegisterEmpleado />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />

        {/* Modal obligatorio para completar registro de Google */}
        <Modal
            show={requiresGoogleRegistration}
            backdrop="static"
            keyboard={false}
            size="lg"
            centered
        >
          <Modal.Header className="modal-header-custom">
            <img className='logoEmpresa' src={IconoEmpresa} alt="Icono Empresa" style={{ width: '40px', height: '40px' }} />
            <Modal.Title className="modal-title-custom">EL BUEN SABOR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RegisterGoogle onFinish={handleGoogleRegistrationFinish} />
          </Modal.Body>
        </Modal>
      </>
  );
}

function App() {
  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}

export default App
