package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.repository.ArticuloRepository;
import com.lab4.buen_sabor_backend.service.ArticuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ArticuloServiceImpl extends MasterServiceImpl<Articulo, Long>
        implements ArticuloService {

    private final ArticuloRepository articuloRepository;
    @Autowired
    public ArticuloServiceImpl(ArticuloRepository articuloRepository, ArticuloRepository articuloRepository1) {
        super(articuloRepository);
        this.articuloRepository = articuloRepository1;
    }

    @Override
    public boolean existsById(Long id) {
        return articuloRepository.existsById(id);
    }

    @Override
    public List<Articulo> findByDenominacionAndEliminadoFalse(String denominacion) {
        return articuloRepository.findByDenominacionContainingIgnoreCaseAndEliminadoFalse(denominacion);
    }
}
