package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Domicilio;
import org.springframework.stereotype.Repository;

@Repository
public interface DomicilioRepository extends MasterRepository<Domicilio, Long> {
}