package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PedidoRepository extends MasterRepository<Pedido, Long>, JpaSpecificationExecutor<Pedido> {

    //búsqueda para los pedidos por cliente.
    Optional<Pedido> findByIdAndClienteId(Long id, Long clienteId);

    @Modifying
    @Transactional
    @Query("UPDATE Pedido p SET p.pagado = :estado WHERE p.id = :pedidoId")
    void changeEstado(@Param("pedidoId") Long pedidoId, @Param("estado") boolean estado);

    Pedido findFirstByClienteIdOrderByIdDesc(Long clienteId);

    Optional<Pedido> findByIdAndSucursalId(Long idPedido, Long idSucursal);

    //busqueda para pedido grilla administrador:
    @Query("""
    SELECT p FROM Pedido p
    WHERE (:idSucursal IS NULL OR p.sucursal.id = :idSucursal)
    AND (:estado IS NULL OR p.estado = :estado)
    AND (:clienteNombre IS NULL OR LOWER(p.cliente.nombre) LIKE LOWER(CONCAT('%', :clienteNombre, '%')))
    AND (:idPedido IS NULL OR p.id = :idPedido)
    AND (:idEmpleado IS NULL OR p.empleado.id = :idEmpleado)
    AND (:fechaDesde IS NULL OR p.fechaPedido >= :fechaDesde)
    AND (:fechaHasta IS NULL OR p.fechaPedido <= :fechaHasta)
    AND (:pagado IS NULL OR p.pagado = :pagado)
""")
    Page<Pedido> buscarPedidosFiltrados(
            @Param("idSucursal") Long idSucursal,
            @Param("estado") Estado estado,
            @Param("clienteNombre") String clienteNombre,
            @Param("idPedido") Long idPedido,
            @Param("idEmpleado") Long idEmpleado,
            @Param("fechaDesde") LocalDateTime fechaDesde,
            @Param("fechaHasta") LocalDateTime fechaHasta,
            @Param("pagado") Boolean pagado,
            Pageable pageable
    );
}

