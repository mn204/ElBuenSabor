package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Factura;
import com.lab4.buen_sabor_backend.model.Factura;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.Cliente;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends MasterRepository<Factura, Long> {
/*
    // Buscar factura por ID de pedido
    Optional<Factura> findByPedidoId(Long pedidoId);

    // Buscar facturas por cliente
    @Query("SELECT f FROM Factura f WHERE f.pedido.cliente = :cliente")
    List<Factura> findByCliente(@Param("cliente") Cliente cliente);

    // Buscar facturas en rango de fechas
    List<Factura> findByFechaFacturacionBetween(LocalDate desde, LocalDate hasta);

    // Buscar nota de crédito por ID de factura (suponiendo relación o atributo notaCredito)
    //TODO HAY QUE AVERIGUAR QUE SE PONE EN NOTA_CREDITO
    @Query("SELECT f FROM Factura f WHERE f.mpPaymentType = 'nota_credito' AND f.id = :idFactura")
    Optional<Factura> findNotaCreditoByFacturaId(@Param("idFactura") Long idFactura);

    // Buscar notas de crédito por cliente
    //TODO HAY QUE AVERIGUAR QUE SE PONE EN NOTA_CREDITO
    @Query("SELECT f FROM Factura f WHERE f.mpPaymentType = 'nota_credito' AND f.pedido.cliente = :cliente")
    List<Factura> findNotasCreditoByCliente(@Param("cliente") Cliente cliente);

    // Buscar notas de crédito por rango de fechas
    //TODO HAY QUE AVERIGUAR QUE SE PONE EN NOTA_CREDITO
    @Query("SELECT f FROM Factura f WHERE f.mpPaymentType = 'nota_credito' AND f.fechaFacturacion BETWEEN :desde AND :hasta")
    List<Factura> findNotasCreditoByFechaFacturacionBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);


 */
}
