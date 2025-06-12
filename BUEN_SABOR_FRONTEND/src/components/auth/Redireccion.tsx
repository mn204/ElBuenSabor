import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

const Redireccion = () => {
    const { isAuthenticated, usuario } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const rutaActual = location.pathname;

        // Redirige SOLO si estás en "/" o "/home"
        if (
            isAuthenticated &&
            usuario?.rol &&
            usuario.rol !== "CLIENTE" &&
            (rutaActual === '/' || rutaActual === '/home')
        ) {
            navigate("/empleado");
        }
    }, [isAuthenticated, usuario, location]);

    return null;
};

export default Redireccion;
