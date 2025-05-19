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

    // Buscar receta completa de un producto (usualmente por ID)
    @Query("SELECT a FROM ArticuloInsumo a LEFT JOIN FETCH a.sucursalInsumo si LEFT JOIN FETCH si.existencias WHERE a.id = :id")
    Optional<ArticuloInsumo> obtenerRecetaCompleta(@Param("id") Long id);

    // Buscar ingrediente por nombre exacto (case insensitive)
    Optional<ArticuloInsumo> findByDenominacionIgnoreCase(String denominacion);

    // Buscar ingredientes por coincidencia parcial (case insensitive)
    List<ArticuloInsumo> findByDenominacionContainingIgnoreCase(String denominacion);

    // Buscar ingredientes por rubro (categoría)
    List<ArticuloInsumo> findByCategoria(Categoria categoria);

    // Obtener todos los ingredientes dados de alta (no eliminados y activos)
    @Query("SELECT a FROM ArticuloInsumo a WHERE a.eliminado = false AND a.alta = true")
    List<ArticuloInsumo> findAllActivos();

    // Consultar y controlar el stock actual (sumando existencias por insumo)
    //TODO HAY QUE VER SI ESTA BIEN ESTE TODO
    @Query("""
           SELECT a, SUM(e.cantidad)
           FROM ArticuloInsumo a
           JOIN a.sucursalInsumo si
           JOIN si.existencias e
           WHERE a.eliminado = false
           GROUP BY a
           """)
    List<Object[]> consultarStockInsumos();  // Devuelve lista de [ArticuloInsumo, StockTotal]
}