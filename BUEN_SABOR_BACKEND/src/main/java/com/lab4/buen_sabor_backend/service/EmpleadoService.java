package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface EmpleadoService extends MasterService<Empleado, Long> {
    public Optional<Empleado> findByUsuarioId(Long usuarioId);

    Page<Empleado> buscarEmpleadosFiltrados(String nombre,
                                            String email,
                                            String rol,
                                            Long idSucursal,
                                            Boolean eliminado,
                                            Pageable pageable);

    List<Empleado> findBySucursalIdAndRol(Long sucursalId, Rol rol);

}