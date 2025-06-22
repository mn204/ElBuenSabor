package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

public interface PedidoService extends MasterService<Pedido, Long> {

    //Esto es para los Pedidos del Cliente
    Page<Pedido> findPedidosByClienteWithFilters(Long clienteId, String sucursalNombre, Estado estado,
                                                 LocalDateTime desde, LocalDateTime hasta, String nombreArticulo,
                                                 Pageable pageable);
    public boolean verificarStockArticulo(Long articuloId, int cantidad, Long sucursalId);
    //Esto es para los Pedidos filtrados para delivery y cocina
    Page<Pedido> buscarPedidosFiltrados(Long idSucursal,
                                        Estado estado,
                                        String nombreCliente,
                                        Long idPedido,
                                        Long idEmpleado,
                                        Boolean pagado,
                                        LocalDateTime fechaDesde,
                                        LocalDateTime fechaHasta,
                                        Pageable pageable);

    //Cambiar pagado del pedido
    Pedido marcarComoPagado(Long id);
    //Cambiar Estado del Pedido
    void cambiarEstadoPedido(Pedido pedido);

    Optional<Pedido> findByIdAndCliente(Long idPedido, Long clienteId);
    void actualizarEstadoPorPago(Long pedidoId, boolean estado);

    //byte[] generarFacturaPDF(Long pedidoId, Long clienteId);
    byte[] generarFacturaPDF(Long pedidoId, Long clienteId);

    void verificarYDescontarStockPedido(Pedido pedido);

    // Generacion de Excel para pedidos
    byte[] exportarPedidosAExcel(List<Pedido> pedidos);

    //Grilla pedidos filtrados para Administrador y cajero

    boolean verificarStockPedido(Pedido pedido);
    Pedido findFirstByClienteIdOrderByIdDesc(Long clienteId);

    Long countPedidosByClienteId(Long clienteId);

    byte[] exportarPedidosFiltradosExcel(
            Long idSucursal,
            Estado estado,
            String clienteNombre,
            Long idPedido,
            Long idEmpleado,
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta,
            Boolean pagado
    );

}