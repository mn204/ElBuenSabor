package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.model.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends MasterRepository<Cliente, Long>,JpaSpecificationExecutor<Cliente> {

    Optional<Cliente> findByUsuarioId(Long usuarioId);

    // Método para buscar con ordenamiento por cantidad de pedidos usando JPQL
    @Query(value = """
        SELECT c FROM Cliente c 
        LEFT JOIN c.pedidos p 
        WHERE (:busqueda IS NULL OR :busqueda = '' OR 
               LOWER(c.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.apellido) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.nombre, ' ', c.apellido)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.apellido, ' ', c.nombre)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))) 
        AND (:email IS NULL OR :email = '' OR 
             LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :email, '%'))) 
        AND (:eliminado IS NULL OR c.eliminado = :eliminado) 
        GROUP BY c.id 
        ORDER BY COUNT(p.id) DESC, c.nombre ASC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT c.id) FROM Cliente c 
        LEFT JOIN c.pedidos p 
        WHERE (:busqueda IS NULL OR :busqueda = '' OR 
               LOWER(c.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.apellido) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.nombre, ' ', c.apellido)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.apellido, ' ', c.nombre)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))) 
        AND (:email IS NULL OR :email = '' OR 
             LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :email, '%'))) 
        AND (:eliminado IS NULL OR c.eliminado = :eliminado)
        """)
    Page<Cliente> findClientesOrderByPedidosDesc(@Param("busqueda") String busqueda,
                                                 @Param("email") String email,
                                                 @Param("eliminado") Boolean eliminado,
                                                 Pageable pageable);

    @Query(value = """
        SELECT c FROM Cliente c 
        LEFT JOIN c.pedidos p 
        WHERE (:busqueda IS NULL OR :busqueda = '' OR 
               LOWER(c.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.apellido) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.nombre, ' ', c.apellido)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.apellido, ' ', c.nombre)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))) 
        AND (:email IS NULL OR :email = '' OR 
             LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :email, '%'))) 
        AND (:eliminado IS NULL OR c.eliminado = :eliminado) 
        GROUP BY c.id 
        ORDER BY COUNT(p.id) ASC, c.nombre ASC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT c.id) FROM Cliente c 
        LEFT JOIN c.pedidos p 
        WHERE (:busqueda IS NULL OR :busqueda = '' OR 
               LOWER(c.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.apellido) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.nombre, ' ', c.apellido)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(CONCAT(c.apellido, ' ', c.nombre)) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR 
               LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))) 
        AND (:email IS NULL OR :email = '' OR 
             LOWER(c.usuario.email) LIKE LOWER(CONCAT('%', :email, '%'))) 
        AND (:eliminado IS NULL OR c.eliminado = :eliminado)
        """)
    Page<Cliente> findClientesOrderByPedidosAsc(@Param("busqueda") String busqueda,
                                                @Param("email") String email,
                                                @Param("eliminado") Boolean eliminado,
                                                Pageable pageable);

/*
    // Buscar cliente por email, haciendo join con UsuarioCliente
    @Query("SELECT c FROM Cliente c WHERE c.usuarioCliente.email = :email AND c.eliminado = false")
    Optional<Cliente> findByUsuarioClienteEmail(@Param("email") String email);

    // Verificar si un cliente está dado de baja (inverso: si existe como eliminado=true)
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Cliente c WHERE c.usuarioCliente.email = :email AND c.eliminado = true")
    boolean existsByUsuarioClienteEmailAndEliminadoTrue(@Param("email") String email);

    // Buscar por nombre o apellido (coincidencia parcial, ignorando mayúsculas)
    List<Cliente> findByEliminadoFalseAndNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);

    // Paginación de clientes dados de alta
    Page<Cliente> findAllByEliminadoFalse(Pageable pageable);

 */
}