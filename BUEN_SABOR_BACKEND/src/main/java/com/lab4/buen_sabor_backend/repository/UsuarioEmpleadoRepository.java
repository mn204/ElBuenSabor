package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.UsuarioEmpleado;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioEmpleadoRepository extends MasterRepository<UsuarioEmpleado, Long> {

    // Buscar por username
    Optional<UsuarioEmpleado> findByUsernameAndEliminadoFalse(String username);

    // Buscar por auth0Id (útil para integraciones con Auth0 o JWT)
    Optional<UsuarioEmpleado> findByAuth0IdAndEliminadoFalse(String auth0Id);

    // Verificar existencia de username
    boolean existsByUsernameAndEliminadoFalse(String username);
}