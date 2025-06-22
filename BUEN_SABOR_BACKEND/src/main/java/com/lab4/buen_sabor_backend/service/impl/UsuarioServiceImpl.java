package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Usuario;
import com.lab4.buen_sabor_backend.repository.UsuarioRepository;
import com.lab4.buen_sabor_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioServiceImpl extends MasterServiceImpl<Usuario, Long> implements UsuarioService {
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        super(usuarioRepository);
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Optional<Usuario> findByFirebaseUid(String firebaseUid) {
        return usuarioRepository.findByFirebaseUid(firebaseUid);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}