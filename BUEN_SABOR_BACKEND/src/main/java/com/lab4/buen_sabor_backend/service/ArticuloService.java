package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Articulo;

public interface ArticuloService extends MasterService<Articulo, Long> {
    boolean existsById(Long id);
}
