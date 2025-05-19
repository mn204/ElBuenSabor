package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.DetallePromocion;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePromocionRepository extends MasterRepository<DetallePromocion, Long> {
}