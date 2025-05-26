package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.model.Master;
import com.lab4.buen_sabor_backend.service.MasterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación genérica para los controladores.
 * Extiende este controlador en cada entidad concreta.
 */
public abstract class MasterControllerImpl<E extends Master, D, ID extends Serializable>
        implements MasterController<D, ID> {

    protected final MasterService<E, ID> service;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    protected MasterControllerImpl(MasterService<E, ID> service) {
        this.service = service;
    }

    protected abstract E toEntity(D dto);
    protected abstract D toDTO(E entity);

    @Override
    public ResponseEntity<D> create(D dto) {
        E savedEntity = service.save(toEntity(dto));
        logger.info("Entidad creada: {}", savedEntity);
        return ResponseEntity.ok(toDTO(savedEntity));
    }

    @Override
    public ResponseEntity<D> getById(ID id) {
        E entity = service.getById(id);
        return ResponseEntity.ok(toDTO(entity));
    }

    @Override
    public ResponseEntity<List<D>> getAll() {
        List<D> dtos = service.getAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @Override
    public ResponseEntity<Page<D>> getAll(Pageable pageable) {
        Page<D> dtoPage = service.getAll(pageable)
                .map(this::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @Override
    public ResponseEntity<D> update(ID id, D dto) {
        E updatedEntity = service.update(id, toEntity(dto));
        logger.info("Entidad actualizada: {}", updatedEntity);
        return ResponseEntity.ok(toDTO(updatedEntity));
    }

    @Override
    public ResponseEntity<Void> delete(ID id) {
        service.delete(id);
        logger.info("Entidad con id {} eliminada lógicamente.", id);
        return ResponseEntity.noContent().build();
    }
}
