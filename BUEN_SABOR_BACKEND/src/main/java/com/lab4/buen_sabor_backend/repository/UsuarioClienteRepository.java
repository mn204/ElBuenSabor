package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.UsuarioCliente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioClienteRepository extends MasterRepository<UsuarioCliente, Long> {

    /*
    // Buscar por email (para evitar duplicados)
    Optional<UsuarioCliente> findByEmailAndEliminadoFalse(String email);

    // Autenticación por email y contraseña (en crudo, se recomienda validar hash en el servicio)
    Optional<UsuarioCliente> findByEmailAndPasswordAndEliminadoFalse(String email, String password);

    // Alternativa si se quiere saber si el email ya existe (sin traer el objeto completo)
    boolean existsByEmailAndEliminadoFalse(String email);
    */
}