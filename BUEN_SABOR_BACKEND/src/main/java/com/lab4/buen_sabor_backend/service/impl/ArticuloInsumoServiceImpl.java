package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.model.ImagenArticulo;
import com.lab4.buen_sabor_backend.repository.ArticuloInsumoRepository;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ArticuloInsumoServiceImpl extends MasterServiceImpl<ArticuloInsumo, Long> implements ArticuloInsumoService {

    private static final Logger logger = LoggerFactory.getLogger(ArticuloInsumoServiceImpl.class);

    private final ArticuloInsumoRepository articuloInsumoRepository;

    @Autowired
    public ArticuloInsumoServiceImpl(ArticuloInsumoRepository articuloInsumoRepository) {
        super(articuloInsumoRepository);
        this.articuloInsumoRepository = articuloInsumoRepository;
    }
/*
    @Override
    @Transactional
    public Optional<ArticuloInsumo> obtenerRecetaCompleta(Long id) {
        logger.info("Obteniendo receta completa para ArticuloInsumo con id: {}", id);
        return articuloInsumoRepository.obtenerRecetaCompleta(id);
    }
    */
    @Override
    @Transactional
    public Optional<ArticuloInsumo> findByDenominacion(String denominacion) {
        logger.info("Buscando ArticuloInsumo por denominación: {}", denominacion);
        return articuloInsumoRepository.findByDenominacionIgnoreCase(denominacion);
    }

    @Override
    @Transactional
    public List<ArticuloInsumo> findByDenominacionContaining(String denominacion) {
        logger.info("Buscando ArticuloInsumo que contengan: {}", denominacion);
        return articuloInsumoRepository.findByDenominacionContainingIgnoreCase(denominacion);
    }

    @Override
    @Transactional
    public List<ArticuloInsumo> findByCategoria(Categoria categoria) {
        logger.info("Buscando ArticuloInsumo por categoría: {}", categoria.getDenominacion());
        return articuloInsumoRepository.findByCategoria(categoria);
    }

    @Override
    @Transactional
    public List<ArticuloInsumo> findAllEsParaElaborar() {
        logger.info("Obteniendo todos los ArticuloInsumo que son para elaborar");
        return articuloInsumoRepository.findAllEsParaElaborar();
    }

    @Override
    @Transactional
    public List<ArticuloInsumo> findAllNoEsParaElaborar() {
        logger.info("Obteniendo todos los ArticuloInsumo que son para elaborar");
        return articuloInsumoRepository.findArticuloInsumosByEsParaElaborarFalse();
    }

    @Override
    @Transactional
    public boolean existsByDenominacion(String denominacion) {
        return articuloInsumoRepository.findByDenominacionIgnoreCase(denominacion).isPresent();
    }

    @Override
    @Transactional
    public List<ArticuloInsumo> findAllActivosOrdenados() {
        logger.info("Obteniendo todos los ArticuloInsumo activos ordenados");
        // Implementación simple - podrías agregar el métodos al repository si lo necesitas
        return articuloInsumoRepository.findAllByEliminadoFalse()
                .stream()
                .sorted((a1, a2) -> a1.getDenominacion().compareToIgnoreCase(a2.getDenominacion()))
                .toList();
    }

    @Override
    @Transactional
    public ArticuloInsumo save(ArticuloInsumo entity) {
        // Validación de duplicados antes de guardar
        if (entity.getId() == null && existsByDenominacion(entity.getDenominacion())) {
            throw new IllegalArgumentException("Ya existe un ingrediente con la denominación: " + entity.getDenominacion());
        }
        for(ImagenArticulo imagen: entity.getImagenes()) {
            imagen.setArticulo(entity);
        }

        logger.info("Guardando ArticuloInsumo: {}", entity.getDenominacion());
        return super.save(entity);
    }

    @Override
    @Transactional
    public ArticuloInsumo update(Long id, ArticuloInsumo entity) {
        ArticuloInsumo existing = getById(id);

        // Validar denominación duplicada solo si cambió
        if (!existing.getDenominacion().equalsIgnoreCase(entity.getDenominacion()) &&
                existsByDenominacion(entity.getDenominacion())) {
            throw new IllegalArgumentException("Ya existe un ingrediente con la denominación: " + entity.getDenominacion());
        }

        for(ImagenArticulo imagen: entity.getImagenes()) {
            imagen.setArticulo(entity);
        }

        logger.info("Actualizando ArticuloInsumo id: {} con nueva denominación: {}", id, entity.getDenominacion());
        return super.update(id, entity);
    }




}