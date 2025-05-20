package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Empresa;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends MasterRepository<Empresa, Long> {
}