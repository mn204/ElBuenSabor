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
      return sucursalesData;
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      return [];
    }
  };

  useEffect(() => {
    const inicializarContextoSucursal = async () => {
      try {
        const sucursalesData = await cargarSucursales();

        // Verificamos si hay una sucursal persistida
        const storedSucursal = localStorage.getItem('sucursalActualUsuario');
        if (storedSucursal) {
          const sucursalGuardada: Sucursal = JSON.parse(storedSucursal);
          const existe = sucursalesData.find(s => s.id === sucursalGuardada.id);
          if (existe) {
            setSucursalActual(sucursalGuardada);
            return;
          }
        }

        // Si no hay sucursal guardada o no es válida, usar la por defecto
        const sucursalPorDefecto = sucursalesData.find(s => s.id === 1) || sucursalesData[0];
        if (sucursalPorDefecto) {
          setSucursalActual(sucursalPorDefecto);
          localStorage.setItem('sucursalActualUsuario', JSON.stringify(sucursalPorDefecto));
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
    localStorage.setItem('sucursalActualUsuario', JSON.stringify(sucursal));
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
    throw new Error('useSucursalUsuario debe ser usado dentro de un SucursalProviderUsuario');
  }
  return context;
};
