package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Usuario;
import com.lab4.buen_sabor_backend.repository.UsuarioRepository;
import com.lab4.buen_sabor_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl extends MasterServiceImpl<Usuario, Long> implements UsuarioService {

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        super(usuarioRepository);
    }

}