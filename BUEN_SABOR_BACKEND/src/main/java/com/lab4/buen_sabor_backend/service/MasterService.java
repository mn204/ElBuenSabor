package com.lab4.buen_sabor_backend.service;
import com.lab4.buen_sabor_backend.model.Master;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;

public interface MasterService<E extends Master, ID extends Serializable> {
    E save(E entity); // Guarda una nueva entidad
    E getById(ID id); // Busca por ID
    List<E> getAll(); // Devuelve todas las entidades no eliminadas
    List<E> getAllEliminadoFalse(); // Devuelve todas las entidades no eliminadas
    Page<E> getAll(Pageable pageable); // Soporte para paginación
    Page<E> getAllEliminadoFalse(Pageable pageable); // Soporte para paginación
    E update(ID id, E entity); // Actualiza la entidad por ID
    void delete(ID id); // Eliminación lógica
    void changeEliminado(ID id); // Cambio de eliminado a false
}
