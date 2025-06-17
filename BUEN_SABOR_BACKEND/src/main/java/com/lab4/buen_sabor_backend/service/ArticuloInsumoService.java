package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.model.Categoria;

import java.util.List;
import java.util.Optional;

public interface ArticuloInsumoService extends MasterService<ArticuloInsumo, Long> {


    //Obtiene la receta completa de un artículo insumo con sus sucursales y existencias
    //Optional<ArticuloInsumo> obtenerRecetaCompleta(Long id);
    //Optional<ArticuloInsumo> obtenerRecetaCompleta(Long id);
    //Baja Logica
    void bajaLogica(Long id);
    //Alta logica
    void altaLogica(Long id);

    /**
     * Busca un ingrediente por nombre exacto (case insensitive)
     */

    Optional<ArticuloInsumo> findByDenominacion(String denominacion);

    /**
     * Busca ingredientes por coincidencia parcial en el nombre
     */
    List<ArticuloInsumo> findByDenominacionContaining(String denominacion);

    /**
     * Obtiene ingredientes por categoría/rubro
     */
    List<ArticuloInsumo> findByCategoria(Categoria categoria);

    /**
     * Obtiene todos los ingredientes que son para elaborar
     */
    List<ArticuloInsumo> findAllEsParaElaborar();
    List<ArticuloInsumo> findAllNoEsParaElaborar();

    /**
     * Verifica si un ingrediente existe por denominación (para evitar duplicados)
     */
    boolean existsByDenominacion(String denominacion);

    /**
     * Obtiene ingredientes activos ordenados por denominación
     */
    List<ArticuloInsumo> findAllActivosOrdenados();
}

