export default class PedidoResumen {
    id?: number = 0;
    fechaPedido: Date = new Date();
    estado: string = "";
    cliente: string = "";
    sucursal: string = "";
    total: number = 0;
}