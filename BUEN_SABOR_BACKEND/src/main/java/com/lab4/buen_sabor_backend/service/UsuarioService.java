package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Usuario;

import java.util.Optional;

public interface UsuarioService extends MasterService<Usuario, Long> {
    Optional<Usuario> findByFirebaseUid(String firebaseUid);
    Optional<Usuario> findByEmail(String email);

}