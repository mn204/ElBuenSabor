package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.model.Categoria;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloInsumoRepository extends MasterRepository<ArticuloInsumo, Long> {
    /*
    Optional<ArticuloInsumo> obtenerRecetaCompleta(@Param("id") Long id);
     */

    // Buscar ingrediente por nombre exacto (case insensitive)
    Optional<ArticuloInsumo> findByDenominacionIgnoreCase(String denominacion);

    // Buscar ingredientes por coincidencia parcial (case insensitive)
    List<ArticuloInsumo> findByDenominacionContainingIgnoreCase(String denominacion);

    // Buscar ingredientes por rubro (categoría)
    List<ArticuloInsumo> findByCategoria(Categoria categoria);

    // Obtener todos los ingredientes que son ParaElaborar (no eliminados y son para Elaborar)
    @Query("SELECT a FROM ArticuloInsumo a WHERE a.eliminado = false AND a.esParaElaborar = true")
    List<ArticuloInsumo> findAllEsParaElaborar();
    List<ArticuloInsumo> findArticuloInsumosByEsParaElaborarFalse();
    List<ArticuloInsumo> findByEsParaElaborarFalseAndDenominacionContainingIgnoreCaseAndEliminadoFalse(String denominacion);
}