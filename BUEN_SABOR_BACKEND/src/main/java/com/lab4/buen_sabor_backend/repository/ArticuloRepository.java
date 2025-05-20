package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Articulo;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticuloRepository extends MasterRepository<Articulo, Long> {
}