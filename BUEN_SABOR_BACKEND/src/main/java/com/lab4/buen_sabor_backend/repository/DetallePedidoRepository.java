package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.DetallePedido;

import com.lab4.buen_sabor_backend.model.Pedido;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends MasterRepository<DetallePedido, Long> {

    List<DetallePedido> findByPedido(Pedido pedido);

    // Calcular subtotal del pedido (suma de los subtotales)
    @Query("SELECT SUM(d.subTotal) FROM DetallePedido d WHERE d.pedido.id = :pedidoId")
    Double calcularSubtotalPorPedido(@Param("pedidoId") Long pedidoId);
}