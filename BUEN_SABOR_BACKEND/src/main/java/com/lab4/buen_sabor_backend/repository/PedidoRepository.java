package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.model.Sucursal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends MasterRepository<Pedido, Long> {

/*
    // Buscar pedidos por cliente o estado
    List<Pedido> findByClienteOrEstado(Cliente cliente, Estado estado);

    // Buscar pedido por ID exacto
    Optional<Pedido> findById(Long id);

    // Calcular tiempo estimado basado en productos
    // Este métodoo es de lógica de negocio, por lo general va en el service.
    // Pero si se quiere manejar por query, se puede usar uno así:
    @Query("""
           SELECT SUM(dp.cantidad * a.tiempoEstimadoCocina) 
           FROM Pedido p 
           JOIN p.detalles dp 
           JOIN dp.articulo a 
           WHERE p.id = :pedidoId
           """)
    Optional<Integer> calcularTiempoEstimado(@Param("pedidoId") Long pedidoId);

    // Buscar pedidos con paginación según estado (para cajero)
    Page<Pedido> findByEstado(Estado estado, Pageable pageable);

    // Actualizar estado del pedido
    @Modifying
    @Query("UPDATE Pedido p SET p.estado = :estado WHERE p.id = :pedidoId")
    void actualizarEstado(@Param("pedidoId") Long pedidoId, @Param("estado") Estado estado);

    // Verificar si un pedido contiene ítems de cocina (artículos que no son insumos)
    @Query("""
           SELECT CASE WHEN COUNT(dp) > 0 THEN true ELSE false END
           FROM Pedido p
           JOIN p.detalles dp
           JOIN dp.articulo a
           WHERE p.id = :pedidoId AND TYPE(a) = ArticuloManufacturado
           """)
    boolean contieneItemsDeCocina(@Param("pedidoId") Long pedidoId);

    // Buscar pedidos con estado "En delivery"
    List<Pedido> findByEstadoAndTipoEnvio(Estado estado, com.lab4.buen_sabor_backend.model.enums.TipoEnvio tipoEnvio);

    // Obtener información de entrega detallada
    @Query("""
           SELECT p FROM Pedido p
           JOIN FETCH p.cliente c
           JOIN FETCH p.sucursal s
           WHERE p.id = :pedidoId
           """)
    Optional<Pedido> obtenerInformacionEntrega(@Param("pedidoId") Long pedidoId);

    // Buscar pedidos en cocina con prioridad por tiempo (por hora de pedido ascendente)
    @Query("""
           SELECT p FROM Pedido p 
           WHERE p.estado = com.lab4.buen_sabor_backend.model.enums.Estado.PREPARACION 
           ORDER BY p.fechaPedido ASC
           """)
    List<Pedido> pedidosEnCocinaOrdenados();

    // Actualizar tiempo estimado de finalización
    @Modifying
    @Query("UPDATE Pedido p SET p.horaEstimadaFinalizacion = :nuevaHora WHERE p.id = :pedidoId")
    void actualizarHoraEstimada(@Param("pedidoId") Long pedidoId, @Param("nuevaHora") java.time.LocalTime nuevaHora);

    // Buscar pedidos con paginación (para historial del cliente)
    Page<Pedido> findByCliente(Cliente cliente, Pageable pageable);

    // Contar pedidos por cliente
    Long countByCliente(Cliente cliente);

 */

}