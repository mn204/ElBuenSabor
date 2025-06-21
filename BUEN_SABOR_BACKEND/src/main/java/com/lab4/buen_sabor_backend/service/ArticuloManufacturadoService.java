package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArticuloManufacturadoService extends MasterService<ArticuloManufacturado, Long> {

    // Métodos específicos para ArticuloManufacturado
    List<ArticuloManufacturado> findAll();

    /**
     * Busca productos por denominación (nombre)
     */
    List<ArticuloManufacturado> findByDenominacion(String denominacion);

    /**
     * Busca productos por categoría
     */
    List<ArticuloManufacturado> findByCategoria(Long categoriaId);
    /**
     * Busca productos en un rango de precio
     */
    List<ArticuloManufacturado> findByRangoPrecio(Double precioMin, Double precioMax);
    List<ArticuloManufacturado> findByDetalleArticuloId(Long id);

    /**
     * Busca productos por tiempo máximo de preparación
     */
    List<ArticuloManufacturado> findByTiempoMaximo(Integer tiempoMaximo);

    /**
     * Obtiene todos los productos con sus ingredientes cargados
     */
    List<ArticuloManufacturado> findAllWithIngredientes();

    /**
     * Obtiene productos por categoría con ingredientes cargados
     */
    List<ArticuloManufacturado> findByCategoriaWithIngredientes(Long categoriaId);

    /**
     * Obtiene productos activos con paginación ordenados por nombre
     */
    Page<ArticuloManufacturado> findActivosOrdenados(Pageable pageable);

    /**
     * Valida que el producto tenga al menos un ingrediente
     */
    void validarIngredientes(ArticuloManufacturado producto);

    /**
     * Calcula el costo total del producto basado en sus ingredientes
     */
    Double calcularCostoTotal(ArticuloManufacturado producto);

    /**
     * Verifica si existe un producto con la misma denominación
     */
    boolean existeByDenominacion(String denominacion);

    /**
     * Verifica si existe un producto con la misma denominación excluyendo un ID
     */
    boolean existeByDenominacionExcluyendoId(String denominacion, Long id);
}