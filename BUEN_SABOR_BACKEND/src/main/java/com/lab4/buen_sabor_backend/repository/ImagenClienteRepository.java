package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.ImagenCliente;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagenClienteRepository extends MasterRepository<ImagenCliente, Long> {
}