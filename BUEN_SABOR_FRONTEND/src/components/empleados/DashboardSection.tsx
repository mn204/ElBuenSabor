import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSucursal } from '../../context/SucursalContextEmpleado';
import ArticuloInsumoService from '../../services/ArticuloInsumoService';
import ArticuloInsumo from '../../models/ArticuloInsumo';

interface DashboardSectionProps {
    sucursalActual?: ReturnType<typeof useSucursal>['sucursalActual'];
    esModoTodasSucursales?: boolean;
    sucursalIdSeleccionada: number | null;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
    sucursalActual,
    esModoTodasSucursales = false,
    sucursalIdSeleccionada
}) => {
    const navigate = useNavigate();
    const [stockBajo, setStockBajo] = useState<ArticuloInsumo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStockBajo = async () => {
            setLoading(true);
            try {
                let data: ArticuloInsumo[] = [];
                
                if (esModoTodasSucursales) {
                    // Obtener stock bajo para todas las sucursales
                    data = await ArticuloInsumoService.obtenerArticulosConStockBajo2(null);
                } else if (sucursalIdSeleccionada) {
                    // Obtener stock bajo para la sucursal específica
                    data = await ArticuloInsumoService.obtenerArticulosConStockBajo2(sucursalIdSeleccionada);
                }
                
                setStockBajo(data);
            } catch (error) {
                console.error('Error al obtener insumos con stock bajo', error);
                setStockBajo([]);
            } finally {
                setLoading(false);
            }
        };

        // Solo ejecutar si tenemos datos válidos
        if (esModoTodasSucursales || sucursalIdSeleccionada) {
            fetchStockBajo();
            const interval = setInterval(fetchStockBajo, 60000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [esModoTodasSucursales, sucursalIdSeleccionada]);

    const getTitleText = () => {
        if (esModoTodasSucursales) {
            return "Dashboard - Todas las Sucursales";
        } else if (sucursalActual) {
            return `Dashboard - ${sucursalActual.nombre}`;
        } else {
            return "Dashboard";
        }
    };

    const getSucursalInfo = () => {
        if (esModoTodasSucursales) {
            return (
                <div className="mt-3 mb-4">
                    <strong>Modo:</strong> Visualización de todas las sucursales<br />
                    <strong>Datos:</strong> Información consolidada de todas las ubicaciones
                </div>
            );
        } else if (sucursalActual) {
            return (
                <div className="mt-3 mb-4">
                    <strong>Sucursal Actual:</strong> {sucursalActual.nombre}<br />
                    <strong>Horario:</strong> {sucursalActual.horarioApertura} - {sucursalActual.horarioCierre}<br />
                    <strong>Dirección:</strong> {sucursalActual.domicilio?.calle} {sucursalActual.domicilio?.numero}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h4>{getTitleText()}</h4>
            <p>Bienvenido al panel de administración</p>
            
            {getSucursalInfo()}

            <div className="d-flex justify-content-center gap-3 mb-4">
                <button className="dashboard-button" onClick={() => navigate('/empleado/clientes')}>
                    Gestionar Clientes
                </button>
                <button className="dashboard-button" onClick={() => navigate('/empleado/empleados')}>
                    Gestionar Empleados
                </button>
                <button className="dashboard-button" onClick={() => navigate('/empleado/promociones')}>
                    Gestionar Promociones
                </button>
            </div>

            <h5 className="mt-4">Notificaciones de Stock</h5>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <table className="table table-bordered mt-2">
                    <thead className="table-light">
                        <tr>
                            <th>Insumo</th>
                            <th>Unidad de Medida</th>
                            <th>Stock Actual</th>
                            <th>Stock Mínimo</th>
                            {esModoTodasSucursales && <th>Sucursal</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {stockBajo.length === 0 ? (
                            <tr>
                                <td colSpan={esModoTodasSucursales ? 5 : 4} className="text-center">
                                    No hay alertas de stock.
                                </td>
                            </tr>
                        ) : (
                            stockBajo.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.denominacion}</td>
                                    <td>{item.unidadMedida.denominacion}</td>
                                    <td>{item.sucursalInsumo?.stockActual}</td>
                                    <td>{item.sucursalInsumo?.stockMinimo}</td>
                                    {esModoTodasSucursales && (
                                        <td>{item.sucursalInsumo?.sucursal?.nombre || 'N/A'}</td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashboardSection;