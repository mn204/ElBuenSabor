import Articulo from "./Articulo";
import type Pedido from "./Pedido";

export default class DetallePedido {
    id?: number;
    cantidad: number = 0;
    subTotal: number = 0;
    pedido!: Pedido;
    articulo!: Articulo;
}