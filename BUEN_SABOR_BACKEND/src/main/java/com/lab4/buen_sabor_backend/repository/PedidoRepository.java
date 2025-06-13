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
public interface PedidoRepository extends MasterRepository<Pedido, Long>, JpaSpecificationExecutor<Pedido> {

    //búsqueda para los pedidos por cliente.
    Optional<Pedido> findByIdAndClienteId(Long id, Long clienteId);

    //Busqueda para pedidos por pedido y sucursal.
    Optional<Pedido> findByIdAndSucursalId(Long idPedido, Long idSucursal);
}