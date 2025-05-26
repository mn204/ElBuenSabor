package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.SucursalDTO;
import com.lab4.buen_sabor_backend.model.Sucursal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface SucursalRepository extends MasterRepository<Sucursal, Long> {

    /*
    Optional<Sucursal> findByNombreIgnoreCase(String nombre);

    List<Sucursal> findByDireccionContainingIgnoreCase(String direccionParte);

    @Query("SELECT new com.lab4.buen_sabor_backend.dto.SucursalDTO(s.id, s.nombre, s.direccion) FROM Sucursal s")
    List<SucursalDTO> findAllDTO();

    // Métrica: contar empleados por sucursal (podemos usar la consulta en EmpleadoRepository también)

     */
}