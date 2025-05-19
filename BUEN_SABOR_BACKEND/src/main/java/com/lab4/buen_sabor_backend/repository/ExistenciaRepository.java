package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Existencia;
import org.springframework.stereotype.Repository;

@Repository
public interface ExistenciaRepository extends MasterRepository<Existencia, Long> {
}