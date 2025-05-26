package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.repository.CategoriaRepository;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoriaServiceImpl extends MasterServiceImpl<Categoria, Long> implements CategoriaService {

    @Autowired
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        super(categoriaRepository);
    }

}