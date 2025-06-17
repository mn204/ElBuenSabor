package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Promocion;

public interface PromocionService extends MasterService<Promocion, Long> {
    boolean existsById(Long id);
}