package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Categoria;

import java.util.List;

public interface CategoriaService extends MasterService<Categoria, Long> {
    List<Categoria> findAllByCategoriaPadreNotNull();
    List<Categoria> findByDenominacionAndEliminadoFalse(String denominacion);
}