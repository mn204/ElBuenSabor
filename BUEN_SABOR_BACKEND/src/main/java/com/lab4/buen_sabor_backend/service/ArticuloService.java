package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Articulo;

import java.util.List;

public interface ArticuloService extends MasterService<Articulo, Long> {
    boolean existsById(Long id);
    List<Articulo> findByDenominacionAndEliminadoFalse(String denominacion);

}
