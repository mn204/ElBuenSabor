package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends MasterRepository<Empleado, Long> {
    Optional<Empleado> findByUsuarioId(Long usuarioId);

/*
    // Buscar por username haciendo join con UsuarioEmpleado
    @Query("SELECT e FROM Empleado e WHERE e.usuarioEmpleado.username = :username AND e.eliminado = false")
    Optional<Empleado> findByUsuarioEmpleadoUsername(@Param("username") String username);

    // Verificar si el empleado está dado de baja (eliminado = true)
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empleado e WHERE e.usuarioEmpleado.username = :username AND e.eliminado = true")
    boolean existsByUsuarioEmpleadoUsernameAndEliminadoTrue(@Param("username") String username);

    // Buscar por nombre o apellido
    List<Empleado> findByEliminadoFalseAndNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);

    // Paginación empleados activos
    Page<Empleado> findAllByEliminadoFalse(Pageable pageable);

 */
}