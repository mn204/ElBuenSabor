package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends MasterRepository<Cliente, Long> {

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
}