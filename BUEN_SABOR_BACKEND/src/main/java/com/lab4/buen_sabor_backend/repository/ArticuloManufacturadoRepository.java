package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import com.lab4.buen_sabor_backend.model.Categoria;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticuloManufacturadoRepository extends MasterRepository<ArticuloManufacturado, Long> {

    // Buscar productos dados de alta y no eliminados
    List<ArticuloManufacturado> findByEliminadoFalseAndAltaTrue();

    // Buscar productos por categoría/rubro
    List<ArticuloManufacturado> findByCategoriaAndEliminadoFalseAndAltaTrue(Categoria categoria);

    // Verificar disponibilidad de ingredientes para mostrar productos no disponibles
    //TODO este QUERY ESTA MAL, HAY QUE HACERLO BIEN.
    @Query("""
        SELECT a FROM ArticuloManufacturado a
        JOIN a.detalles d
        WHERE d.articuloInsumo.stockActual >= d.cantidad
        AND a.eliminado = false AND a.alta = true
        GROUP BY a
        HAVING COUNT(d) = (SELECT COUNT(d2) FROM DetalleArticuloManufacturado d2 WHERE d2.articuloManufacturado = a)
    """)
    List<ArticuloManufacturado> findProductosDisponibles();

    // Buscar productos por nombre o descripción (coincidencia parcial, ignorando mayúsculas/minúsculas)
    @Query("""
        SELECT a FROM ArticuloManufacturado a
        WHERE LOWER(a.denominacion) LIKE LOWER(CONCAT('%', :texto, '%'))
        OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))
        AND a.eliminado = false AND a.alta = true
    """)
    List<ArticuloManufacturado> buscarPorNombreODescripcion(@Param("texto") String texto);

    // Buscar producto por nombre exacto (para evitar duplicados)
    boolean existsByDenominacionIgnoreCaseAndEliminadoFalse(String denominacion);

    // Buscar productos por ingrediente contenido
    @Query("""
        SELECT a FROM ArticuloManufacturado a
        JOIN a.detalles d
        WHERE d.articuloInsumo.id = :idInsumo AND a.eliminado = false AND a.alta = true
    """)
    List<ArticuloManufacturado> findByInsumo(@Param("idInsumo") Long idInsumo);

    // Buscar productos por rango de tiempo de cocina
    List<ArticuloManufacturado> findByTiempoEstimadoMinutosBetweenAndEliminadoFalseAndAltaTrue(Integer desde, Integer hasta);

    // Obtener todos los productos dados de alta (para menú del cliente)
    List<ArticuloManufacturado> findAllByAltaTrueAndEliminadoFalse();
}