package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.UsuarioCliente;
import com.lab4.buen_sabor_backend.repository.UsuarioClienteRepository;
import com.lab4.buen_sabor_backend.service.UsuarioClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioClienteServiceImpl extends MasterServiceImpl<UsuarioCliente, Long> implements UsuarioClienteService {

    @Autowired
    public UsuarioClienteServiceImpl(UsuarioClienteRepository usuarioClienteRepository) {
        super(usuarioClienteRepository);
    }

}