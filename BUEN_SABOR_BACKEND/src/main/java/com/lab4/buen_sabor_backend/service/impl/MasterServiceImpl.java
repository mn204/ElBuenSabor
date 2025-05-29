package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.Master;
import com.lab4.buen_sabor_backend.repository.MasterRepository;
import com.lab4.buen_sabor_backend.service.MasterService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;


public abstract class MasterServiceImpl <E extends Master, ID extends Serializable> implements MasterService<E, ID> {

    protected final MasterRepository<E, ID> masterRepository;
    private static final Logger logger = LoggerFactory.getLogger(MasterServiceImpl.class);

    public MasterServiceImpl(MasterRepository<E, ID> masterRepository) {
        this.masterRepository = masterRepository;
    }

    @Override
    @Transactional
    public E save(E entity) {
        E saved = masterRepository.save(entity);
        logger.info("Entidad guardada: {}", saved);
        return saved;
    }

    @Override
    @Transactional
    public E getById(ID id) {
        return masterRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Entidad no encontrada con id: {}", id);
                    return new EntityNotFoundException("Entidad no encontrada con id: " + id);
                });
    }

    @Override
    @Transactional
    public List<E> getAllEliminadoFalse() {
        List<E> entities = masterRepository.findAllByEliminadoFalse();
        logger.info("Entidades obtenidas (no eliminadas): {}", entities.size());
        return entities;
    }

    @Override
    @Transactional
    public Page<E> getAllEliminadoFalse(Pageable pageable) {
        Page<E> entities = masterRepository.findAllByEliminadoFalse(pageable);
        logger.info("Página obtenida: {} elementos", entities.getNumberOfElements());
        return entities;
    }

    @Override
    @Transactional
    public List<E> getAll() {
        List<E> entities = masterRepository.findAll();
        logger.info("Entidades obtenidas (no eliminadas): {}", entities.size());
        return entities;
    }

    @Override
    @Transactional
    public Page<E> getAll(Pageable pageable) {
        Page<E> entities = masterRepository.findAll(pageable);
        logger.info("Página obtenida: {} elementos", entities.getNumberOfElements());
        return entities;
    }

    @Override
    @Transactional
    public E update(ID id, E entity) {
        if (!masterRepository.existsById(id)) {
            logger.warn("Intento de actualizar entidad inexistente con id: {}", id);
            throw new EntityNotFoundException("No existe una entidad con id: " + id);
        }

        entity.setId((Long) id); // ⚠️ Asegúrate que ID sea Long, o mejora con conversiones seguras
        E updated = masterRepository.save(entity);
        logger.info("Entidad actualizada: {}", updated);
        return updated;
    }

    @Override
    @Transactional
    public void delete(ID id) {
        E entity = masterRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la entidad con id: " + id));

        entity.setEliminado(true);
        masterRepository.save(entity);
        logger.info("Entidad eliminada lógicamente: {}", entity);
    }

}
