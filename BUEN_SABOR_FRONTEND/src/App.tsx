import './App.css'
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
import LoginEmpleado from "./components/auth/LoginEmpleado.tsx";
function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/accionManufacturado" element={<FormArticuloManufacturado />} />
        <Route path="/manufacturados" element={<GrillaArticuloManufacturado />} />
        <Route path="/categorias" element={<GrillaCategorias />} />
        <Route path="/articulos" element={<GrillaInsumos />} />
        <Route path="/unidades" element={<GrillaUnidadMedida />} />
        <Route path="/imagenes" element={<GrillaImagenArticulo />} />
        <Route path="/historicocompra" element={<GrillaHistoricoCompra />} />
        <Route path="/historicoventa" element={<GrillaHistoricoVenta />} />
        <Route path="/categoria" element={<FormCategoria />} />
          <Route path="/admin/nuevo-empleado/" element={<RegisterEmpleado/>} />
          <Route path="/admin/login-empleado/" element={<LoginEmpleado/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
