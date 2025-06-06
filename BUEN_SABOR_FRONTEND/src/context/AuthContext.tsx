import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../components/auth/firebase';
import Usuario from '../models/Usuario';
import Cliente from '../models/Cliente';
import Empleado from '../models/Empleado';
import Rol from '../models/enums/Rol';
import { obtenerUsuarioPorFirebaseUid } from '../services/UsuarioService';
import { obtenerClientePorUsuarioId } from '../services/ClienteService';
import { obtenerEmpleadoPorUsuarioId } from '../services/EmpleadoService';

interface AuthContextType {
    user: User | null;
    usuario: Usuario | null;
    cliente: Cliente | null;
    empleado: Empleado | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    hasRole: (roles: Rol[]) => boolean;
    getUserDisplayName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [empleado, setEmpleado] = useState<Empleado | null>(null);
    const [loading, setLoading] = useState(true);

    // Función para cargar datos del usuario desde el backend
    const loadUserData = async (firebaseUser: User) => {
        try {
            // Obtener datos del usuario desde el backend
            const usuarioData = await obtenerUsuarioPorFirebaseUid(firebaseUser.uid);
            setUsuario(usuarioData);

            // Dependiendo del rol, cargar datos específicos
            if (usuarioData.rol === Rol.CLIENTE) {
                try {
                    const clienteData = await obtenerClientePorUsuarioId(usuarioData.id);
                    setCliente(clienteData);
                    setEmpleado(null);
                } catch (error) {
                    console.error('Error al cargar datos del cliente:', error);
                }
            } else {
                // Es un empleado (ADMIN, CAJERO, COCINERO, DELIVERY)
                try {
                    const empleadoData = await obtenerEmpleadoPorUsuarioId(usuarioData.id);
                    setEmpleado(empleadoData);
                    setCliente(null);
                } catch (error) {
                    console.error('Error al cargar datos del empleado:', error);
                }
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
            // Si hay error, limpiar todos los datos
            setUsuario(null);
            setCliente(null);
            setEmpleado(null);
        }
    };

    // Escuchar cambios en el estado de autenticación de Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                await loadUserData(firebaseUser);
            } else {
                setUsuario(null);
                setCliente(null);
                setEmpleado(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // loadUserData se ejecutará automáticamente por onAuthStateChanged
    };

    const logout = async () => {
        await signOut(auth);
        setUsuario(null);
        setCliente(null);
        setEmpleado(null);
    };

    const hasRole = (roles: Rol[]): boolean => {
        return usuario ? roles.includes(usuario.rol) : false;
    };

    const getUserDisplayName = (): string => {
        if (cliente) {
            return `${cliente.nombre} ${cliente.apellido}`;
        }
        if (empleado) {
            return `${empleado.nombre} ${empleado.apellido}`;
        }
        if (usuario) {
            return usuario.email;
        }
        return 'Usuario';
    };

    const value = {
        user,
        usuario,
        cliente,
        empleado,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        getUserDisplayName
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};