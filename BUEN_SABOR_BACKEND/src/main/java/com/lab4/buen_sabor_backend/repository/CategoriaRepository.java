package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Categoria;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends MasterRepository<Categoria, Long> {

    List<Categoria> findByCategoriaPadreId(Long id);
    // Buscar rubro por nombre exacto (para evitar duplicados)
    boolean existsByDenominacionIgnoreCaseAndEliminadoFalse(String denominacion);
    List<Categoria> findAllByCategoriaPadreNotNull();
    // Buscar rubros por coincidencia parcial en el nombre
    List<Categoria> findByDenominacionContainingIgnoreCaseAndEliminadoFalse(String nombreParcial);

    List<Categoria> findAll(); // Para mostrar todos
    List<Categoria> findByEliminadoFalse();
    List<Categoria> findByCategoriaPadreIdAndEliminadoFalse(Long categoriaId);
    List<Categoria> findByDenominacionAndEliminadoFalse(String denominacion);

}