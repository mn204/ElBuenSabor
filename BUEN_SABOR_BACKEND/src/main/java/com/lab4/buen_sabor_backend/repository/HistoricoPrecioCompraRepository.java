package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.HistoricoPrecioCompra;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HistoricoPrecioCompraRepository extends MasterRepository<HistoricoPrecioCompra, Long> {
/*
    // Buscar compras por ingrediente
    List<HistoricoPrecioCompra> findByArticulo(ArticuloInsumo articulo);

    // Buscar compras en un rango de fechas
    List<HistoricoPrecioCompra> findByFechaBetween(LocalDate desde, LocalDate hasta);

    // Obtener la última compra de un ingrediente
    @Query("""
           SELECT h FROM HistoricoPrecioCompra h 
           WHERE h.articulo = :articulo 
           ORDER BY h.fecha DESC
           """)
    List<HistoricoPrecioCompra> findUltimaCompra(@Param("articulo") ArticuloInsumo articulo);

    default Optional<HistoricoPrecioCompra> findUltimaCompraUnica(ArticuloInsumo articulo) {
        List<HistoricoPrecioCompra> resultados = findUltimaCompra(articulo);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }

 */
}