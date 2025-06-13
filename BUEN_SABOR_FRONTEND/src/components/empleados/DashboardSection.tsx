import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSucursal } from '../../context/SucursalContextEmpleado';
import ArticuloInsumoService from '../../services/ArticuloInsumoService';
import ArticuloInsumo from '../../models/ArticuloInsumo';

interface DashboardSectionProps {
    sucursalActual: ReturnType<typeof useSucursal>['sucursalActual'];
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ sucursalActual }) => {
    const navigate = useNavigate();
    const [stockBajo, setStockBajo] = useState<ArticuloInsumo[]>([]);

    useEffect(() => {
        const fetchStockBajo = async () => {
            if (!sucursalActual) return;
            try {
                const data = await ArticuloInsumoService.obtenerArticulosConStockBajo(sucursalActual.id!);
                setStockBajo(data);
            } catch (error) {
                console.error('Error al obtener insumos con stock bajo', error);
            }
        };

        fetchStockBajo();
        const interval = setInterval(fetchStockBajo, 60000);
        return () => clearInterval(interval);
    }, [sucursalActual]);

    return (
        <div>
            <h4>Dashboard - {sucursalActual?.nombre}</h4>
            <p>Bienvenido al panel de administración</p>
            {sucursalActual && (
                <div className="mt-3 mb-4">
                    <strong>Sucursal Actual:</strong> {sucursalActual.nombre}<br />
                    <strong>Horario:</strong> {sucursalActual.horarioApertura} - {sucursalActual.horarioCierre}<br />
                    <strong>Dirección:</strong> {sucursalActual.domicilio?.calle} {sucursalActual.domicilio?.numero}
                </div>
            )}

            <div className="d-flex justify-content-center gap-3 mb-4">
                <button className="dashboard-button" onClick={() => navigate('/empleado/clientes')}>Gestionar Clientes</button>
                <button className="dashboard-button" onClick={() => navigate('/empleado/empleados')}>Gestionar Empleados</button>
                <button className="dashboard-button" onClick={() => navigate('/empleado/promociones')}>Gestionar Promociones</button>
            </div>

            <h5 className="mt-4">Notificaciones de Stock</h5>
            <table className="table table-bordered mt-2">
                <thead className="table-light">
                <tr>
                    <th>Insumo</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                </tr>
                </thead>
                <tbody>
                {stockBajo.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="text-center">No hay alertas de stock.</td>
                    </tr>
                ) : (
                    stockBajo.map((n, i) => (
                        <tr key={i}>
                            <td>{n.denominacion}</td>
                            <td>{n.sucursalInsumo?.stockActual}</td>
                            <td>{n.sucursalInsumo?.stockMinimo}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardSection;
