package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends MasterRepository<Usuario, Long> {
    Optional<Usuario> findByFirebaseUid(String firebaseUid);
    Optional<Usuario> findByEmail(String email);
}