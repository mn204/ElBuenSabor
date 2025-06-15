package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Pedido;
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

    //Esto es para los Pedidos filtrados

    //Esto es para los Pedidos filtrados
    Page<Pedido> buscarPedidosFiltrados(Long idSucursal,
                                        Estado estado,
                                        String nombreCliente,
                                        Long idPedido,
                                        Long idEmpleado, // <-- NUEVO PARÁMETRO
                                        LocalDateTime fechaDesde,
                                        LocalDateTime fechaHasta,
                                        Pageable pageable);

    //Cambiar Estado del Pedido
    void cambiarEstadoPedido(Pedido pedido);

    Optional<Pedido> findByIdAndCliente(Long idPedido, Long clienteId);
    void actualizarEstadoPorPago(Long pedidoId, boolean estado);

    //byte[] generarFacturaPDF(Long pedidoId, Long clienteId);
    byte[] generarFacturaPDF(Long pedidoId, Long clienteId);

    void verificarYDescontarStockPedido(Pedido pedido);

    // Generacion de Excel para pedidos
    byte[] exportarPedidosAExcel(List<Pedido> pedidos);
    boolean verificarStockPedido(Pedido pedido);
    Pedido findFirstByClienteIdOrderByIdDesc(Long clienteId);
}