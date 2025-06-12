import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Sucursal from '../models/Sucursal';
import { obtenerSucursales } from '../services/SucursalService';
import { useAuth } from './AuthContext';

interface SucursalContextType {
    sucursalActual: Sucursal | null;
    sucursales: Sucursal[];
    cambiarSucursal: (sucursal: Sucursal) => void;
    loading: boolean;
}

const SucursalContext = createContext<SucursalContextType | undefined>(undefined);

interface SucursalProviderProps {
    children: ReactNode;
}

export const SucursalProvider: React.FC<SucursalProviderProps> = ({ children }) => {
    const [sucursalActual, setSucursalActual] = useState<Sucursal | null>(null);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);
    const { empleado, usuario, isAuthenticated } = useAuth();

    // Cargar todas las sucursales (solo para administradores)
    const cargarSucursales = async () => {
        try {
            if (usuario?.rol === 'ADMINISTRADOR') {
                const sucursalesData = await obtenerSucursales();
                setSucursales(sucursalesData);
            }
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };

    // Inicializar el contexto de sucursal cuando el usuario se autentica
    useEffect(() => {
        const inicializarContextoSucursal = async () => {
            if (!isAuthenticated || !usuario) {
                setSucursalActual(null);
                setSucursales([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                if (usuario.rol === 'ADMINISTRADOR') {
                    // Para administradores: cargar todas las sucursales y establecer por defecto la sucursal 1
                    await cargarSucursales();
                    const sucursalesData = await obtenerSucursales();

                    // Buscar sucursal con id 1 o la primera disponible
                    const sucursalPorDefecto = sucursalesData.find(s => s.id === 1) || sucursalesData[0];
                    if (sucursalPorDefecto) {
                        setSucursalActual(sucursalPorDefecto);
                    }
                } else {
                    // Para empleados regulares: usar la sucursal asignada
                    if (empleado?.sucursal) {
                        setSucursalActual(empleado.sucursal);
                        setSucursales([]); // Los empleados no necesitan ver todas las sucursales
                    }
                }
            } catch (error) {
                console.error('Error al inicializar contexto de sucursal:', error);
            } finally {
                setLoading(false);
            }
        };

        inicializarContextoSucursal();
    }, [empleado, usuario, isAuthenticated]);

    const cambiarSucursal = (sucursal: Sucursal) => {
        // Solo los administradores pueden cambiar de sucursal
        if (usuario?.rol === 'ADMINISTRADOR') {
            setSucursalActual(sucursal);
        } else {
            console.warn('Solo los administradores pueden cambiar de sucursal');
        }
    };

    const value = {
        sucursalActual,
        sucursales,
        cambiarSucursal,
        loading
    };

    return (
        <SucursalContext.Provider value={value}>
            {children}
        </SucursalContext.Provider>
    );
};

export const useSucursal = () => {
    const context = useContext(SucursalContext);
    if (context === undefined) {
        throw new Error('useSucursal debe ser usado dentro de un SucursalProvider');
    }
    return context;
};