import type Cliente from "./Cliente";
import type DetallePedido from "./DetallePedido";
import type Empleado from "./Empleado";
import type  Estado  from "./enums/Estado";
import type  FormaPago  from "./enums/FormaPago";
import type TipoEnvio  from "./enums/TipoEnvio";
import type Factura from "./Factura";
import type Sucursal from "./Sucursal";

export default class Pedido {
    id?: number;
    horaEstimadaFinalizacion: String = "";
    total: number = 0;
    totalCosto: number = 0;
    estado!: Estado;
    tipoEnvio!: TipoEnvio;
    formaPago!: FormaPago;
    fechaPedido: Date = new Date();
    sucursal!: Sucursal;
    cliente!: Cliente;
    empleado!: Empleado;
    factura?: Factura;
    detalles: DetallePedido[] = [];
    eliminado!: boolean;
}