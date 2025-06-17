package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.Estadisticas.*;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EstadisticaRepository extends JpaRepository<Pedido, Long> {

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.EstadisticaSucursalDTO(
            p.sucursal.id,
            p.sucursal.nombre,
            COUNT(p),
            SUM(p.total),
            SUM(p.total - p.totalCosto),
            SUM(CASE WHEN p.estado = 'CANCELADO' THEN 1 ELSE 0 END),
            AVG(TIMESTAMPDIFF(MINUTE, p.fechaPedido, p.horaEstimadaFinalizacion))
        )
        FROM Pedido p
        WHERE p.fechaPedido BETWEEN :desde AND :hasta
        GROUP BY p.sucursal.id, p.sucursal.nombre
    """)
    List<EstadisticaSucursalDTO> obtenerResumenPorSucursal(@Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.ProductoMasVendidoDTO(
            dp.articulo.denominacion,
            SUM(dp.cantidad)
        )
        FROM DetallePedido dp
        WHERE (:sucursalId IS NULL OR dp.pedido.sucursal.id = :sucursalId)
          AND dp.pedido.fechaPedido BETWEEN :desde AND :hasta
        GROUP BY dp.articulo.id, dp.articulo.denominacion
        ORDER BY SUM(dp.cantidad) DESC
    """)
    List<ProductoMasVendidoDTO> obtenerProductosMasVendidos(
            @Param("sucursalId") Long sucursalId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable
    );

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.ClienteFrecuenteDTO(
            p.cliente.id,
            CONCAT(p.cliente.nombre, ' ', p.cliente.apellido),
            COUNT(p)
        )
        FROM Pedido p
        WHERE (:sucursalId IS NULL OR p.sucursal.id = :sucursalId)
          AND p.fechaPedido BETWEEN :desde AND :hasta
          AND (:tipoPedido IS NULL OR p.tipoEnvio = :tipoPedido)
        GROUP BY p.cliente.id, p.cliente.nombre, p.cliente.apellido
        ORDER BY COUNT(p) DESC
    """)
    List<ClienteFrecuenteDTO> obtenerClientesFrecuentesFiltrados(
            @Param("sucursalId") Long sucursalId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            @Param("tipoPedido") TipoEnvio tipoPedido,
            Pageable pageable
    );

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.TicketPromedioDTO(
            p.sucursal.id,
            p.sucursal.nombre,
            (SUM(p.total) * 1.0 / COUNT(p))
        )
        FROM Pedido p
        WHERE p.fechaPedido BETWEEN :desde AND :hasta
          AND (:sucursalId IS NULL OR p.sucursal.id = :sucursalId)
          AND p.estado = 'ENTREGADO'
        GROUP BY p.sucursal.id, p.sucursal.nombre
    """)
    List<TicketPromedioDTO> calcularTicketPromedio(
            @Param("sucursalId") Long sucursalId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.PedidosPorDiaDTO(
            DATE(p.fechaPedido),
            COUNT(p)
        )
        FROM Pedido p
        WHERE (:sucursalId IS NULL OR p.sucursal.id = :sucursalId)
          AND p.fechaPedido BETWEEN :desde AND :hasta
        GROUP BY DATE(p.fechaPedido)
        ORDER BY DATE(p.fechaPedido)
    """)
    List<PedidosPorDiaDTO> obtenerPedidosPorDia(
            @Param("sucursalId") Long sucursalId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.VentasPorDiaDTO(
            DATE(p.fechaPedido),
            SUM(p.total)
        )
        FROM Pedido p
        WHERE (:sucursalId IS NULL OR p.sucursal.id = :sucursalId)
          AND p.fechaPedido BETWEEN :desde AND :hasta
        GROUP BY DATE(p.fechaPedido)
        ORDER BY DATE(p.fechaPedido)
    """)
    List<VentasPorDiaDTO> obtenerVentasPorDia(
            @Param("sucursalId") Long sucursalId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );

    @Query("""
        SELECT new com.lab4.buen_sabor_backend.dto.Estadisticas.PedidosPorTipoDTO(
            p.tipoEnvio, COUNT(p)
        )
        FROM Pedido p
        WHERE (:sucursalId IS NULL OR p.sucursal.id = :sucursalId)
          AND p.fechaPedido BETWEEN :desde AND :hasta
        GROUP BY p.tipoEnvio
    """)
    List<PedidosPorTipoDTO> cantidadPedidosPorTipo(
            @Param("sucursalId") Long sucursalId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta
    );

}
