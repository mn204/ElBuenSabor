package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.repository.EmpleadoRepository;
import com.lab4.buen_sabor_backend.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmpleadoServiceImpl extends MasterServiceImpl<Empleado, Long> implements EmpleadoService {
    private final EmpleadoRepository empleadoRepository;

    @Autowired
    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository) {
        super(empleadoRepository);
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    public Optional<Empleado> findByUsuarioId(Long usuarioId) {
        return empleadoRepository.findByUsuarioId(usuarioId);
    }

}