package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.model.Usuario;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends MasterRepository<Empleado, Long>,JpaSpecificationExecutor<Empleado> {
    Optional<Empleado> findByUsuarioId(Long usuarioId);

    Optional<Empleado> findByDni(String dni);


    @Query("SELECT e FROM Empleado e WHERE e.sucursal.id = :sucursalId AND e.usuario.rol = :rol AND e.usuario.eliminado = false")
    List<Empleado> findBySucursalIdAndRol(@Param("sucursalId") Long sucursalId, @Param("rol") Rol rol);

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