package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.repository.CategoriaRepository;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaServiceImpl extends MasterServiceImpl<Categoria, Long> implements CategoriaService {

    private static final Logger logger = LoggerFactory.getLogger(CategoriaServiceImpl.class);
    private final CategoriaRepository categoriaRepository;


    @Autowired
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        super(categoriaRepository);
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public List<Categoria> findAllByCategoriaPadreNotNull(){
        logger.info("Buscando productos");
        return categoriaRepository.findAllByCategoriaPadreNotNull();
    }
}