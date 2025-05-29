import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './components/layout/Home';
import Perfil from './components/auth/Perfil';
import FormArticuloManufacturado from './components/articulos/FormArticuloManufacturado';
import EliminarArticuloManufacturado from './components/articulos/EliminarArticuloManufacturado';
import ActualizarArticuloManufacturado from './components/articulos/ActualizarArticuloManufacturado';
import RegisterGoogle from './components/auth/RegisterGoogle';

import { useEffect, useState } from 'react';
import { auth } from './components/auth/firebase';

function App() {
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    // ✅ Simulando que el usuario NO existe en backend
                    const simulateUserNotRegistered = true;

                    if (simulateUserNotRegistered) {
                        localStorage.setItem('requiresGoogleRegistration', 'true');
                        setShowGoogleModal(true);
                    } else {
                        localStorage.removeItem('requiresGoogleRegistration');
                        setShowGoogleModal(false);
                    }

                    // ❌ Este bloque está deshabilitado porque el backend no corre
                    /*
                    const token = await user.getIdToken();
                    const res = await fetch(`http://localhost:8080/auth/cliente/uid/${user.uid}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.status === 404) {
                        localStorage.setItem('requiresGoogleRegistration', 'true');
                        setShowGoogleModal(true);
                    } else {
                        localStorage.removeItem('requiresGoogleRegistration');
                        setShowGoogleModal(false);
                    }
                    */
                } catch (error) {
                    console.error('Error al verificar usuario en el backend:', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);


    const handleRegisterComplete = () => {
        localStorage.removeItem('requiresGoogleRegistration');
        setShowGoogleModal(false);
    };

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/manu" element={<FormArticuloManufacturado />} />
                <Route path="/eliminar" element={<EliminarArticuloManufacturado />} />
                <Route path="/actualizar" element={<ActualizarArticuloManufacturado />} />
            </Routes>
            <Footer />

            {/* Modal obligatorio de registro Google */}
            {showGoogleModal && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    role="dialog"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content p-3">
                            <RegisterGoogle onFinish={handleRegisterComplete} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
