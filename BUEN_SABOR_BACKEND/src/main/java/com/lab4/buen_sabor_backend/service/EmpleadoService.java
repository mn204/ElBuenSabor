package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Empleado;

import java.util.Optional;

public interface EmpleadoService extends MasterService<Empleado, Long> {
    public Optional<Empleado> findByUsuarioId(Long usuarioId);
}