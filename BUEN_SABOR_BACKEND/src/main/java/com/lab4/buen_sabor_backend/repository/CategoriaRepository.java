package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Categoria;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends MasterRepository<Categoria, Long> {
/*
    // Buscar rubro por nombre exacto (para evitar duplicados)
    boolean existsByDenominacionIgnoreCaseAndEliminadoFalse(String denominacion);

    // Buscar rubros por coincidencia parcial en el nombre
    List<Categoria> findByDenominacionContainingIgnoreCaseAndEliminadoFalse(String nombreParcial);

    // Obtener todos los rubros dados de alta
    List<Categoria> findAllByAltaTrueAndEliminadoFalse();

    // Obtener rubros activos ordenados (para barra de navegación)
    List<Categoria> findAllByAltaTrueAndEliminadoFalseOrderByDenominacionAsc();

 */
}