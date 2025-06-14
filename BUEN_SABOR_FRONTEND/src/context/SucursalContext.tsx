import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Sucursal from '../models/Sucursal';
import { obtenerSucursales } from '../services/SucursalService';

interface SucursalContextType {
    sucursalActualUsuario: Sucursal | null;
    sucursalesUsuario: Sucursal[];
    cambiarSucursalUsuario: (sucursal: Sucursal) => void;
    loading: boolean;
}

const SucursalContext = createContext<SucursalContextType | undefined>(undefined);

interface SucursalProviderProps {
    children: ReactNode;
}

export const SucursalProviderUsuario: React.FC<SucursalProviderProps> = ({ children }) => {
    const [sucursalActualUsuario, setSucursalActual] = useState<Sucursal | null>(null);
    const [sucursalesUsuario, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);
    const cargarSucursales = async () => {
        try {
            const sucursalesData = await obtenerSucursales();
            setSucursales(sucursalesData);
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };

    // Inicializar el contexto de sucursal cuando el usuario se autentica
    useEffect(() => {
        const inicializarContextoSucursal = async () => {
            try {
                    // Para administradores: cargar todas las sucursales y establecer por defecto la sucursal 1
                    await cargarSucursales();
                    const sucursalesData = await obtenerSucursales();

                    // Buscar sucursal con id 1 o la primera disponible
                    const sucursalPorDefecto = sucursalesData.find(s => s.id === 1) || sucursalesData[0];
                    if (sucursalPorDefecto) {
                        setSucursalActual(sucursalPorDefecto);
                    }
            } catch (error) {
                console.error('Error al inicializar contexto de sucursal:', error);
            } finally {
                setLoading(false);
            }
        };

        inicializarContextoSucursal();
    }, []);

    const cambiarSucursalUsuario = (sucursal: Sucursal) => {
        setSucursalActual(sucursal);
    };

    const value = {
        sucursalActualUsuario,
        sucursalesUsuario,
        cambiarSucursalUsuario,
        loading
    };

    return (
        <SucursalContext.Provider value={value}>
            {children}
        </SucursalContext.Provider>
    );
};

export const useSucursalUsuario = () => {
    const context = useContext(SucursalContext);
    if (context === undefined) {
        throw new Error('useSucursal debe ser usado dentro de un SucursalProvider');
    }
    return context;
};