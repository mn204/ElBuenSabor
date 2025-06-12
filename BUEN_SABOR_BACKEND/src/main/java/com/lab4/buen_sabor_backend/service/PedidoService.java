package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.enums.Estado;

import java.time.LocalDateTime;
import java.util.*;

public interface PedidoService extends MasterService<Pedido, Long> {

    List<Pedido> findPedidosByClienteWithFilters(Long clienteId, String sucursalNombre, Estado estado,
                                                 LocalDateTime desde, LocalDateTime hasta, String nombreArticulo);

    Optional<Pedido> findByIdAndCliente(Long idPedido, Long clienteId);

    byte[] generarFacturaPDF(Long pedidoId, Long clienteId);
}