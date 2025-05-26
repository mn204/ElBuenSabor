package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.UsuarioEmpleado;
import com.lab4.buen_sabor_backend.repository.UsuarioEmpleadoRepository;
import com.lab4.buen_sabor_backend.service.UsuarioEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioEmpleadoServiceImpl extends MasterServiceImpl<UsuarioEmpleado, Long> implements UsuarioEmpleadoService {

    @Autowired
    public UsuarioEmpleadoServiceImpl(UsuarioEmpleadoRepository usuarioEmpleadoRepository) {
        super(usuarioEmpleadoRepository);
    }

}