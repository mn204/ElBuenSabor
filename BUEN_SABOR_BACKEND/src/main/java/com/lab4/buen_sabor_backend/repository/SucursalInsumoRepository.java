package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.SucursalInsumo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SucursalInsumoRepository extends MasterRepository<SucursalInsumo, Long> {

    SucursalInsumo findBySucursalIdAndArticuloInsumoId(Long sucursalId, Long articuloInsumoId);

    // Stock bajo de TODAS las sucursales, con insumo cargado
    @Query("SELECT si FROM SucursalInsumo si JOIN FETCH si.articuloInsumo WHERE si.stockActual < si.stockMinimo")
    List<SucursalInsumo> findAllWithLowStock();

    // Stock bajo de UNA sucursal específica, con insumo cargado
    @Query("SELECT si FROM SucursalInsumo si JOIN FETCH si.articuloInsumo WHERE si.sucursal.id = :idSucursal AND si.stockActual < si.stockMinimo")
    List<SucursalInsumo> findAllWithLowStockBySucursal(@Param("idSucursal") Long idSucursal);

    List<SucursalInsumo> findByArticuloInsumoIdAndEliminadoFalse(Long articuloInsumoId);

    List<SucursalInsumo> findByArticuloInsumoIdAndEliminadoTrue(Long articuloInsumoId);

    List<SucursalInsumo> findBySucursalId(Long sucursalId);

    @Query("""
        SELECT si FROM SucursalInsumo si
        WHERE (:idSucursal IS NULL OR si.sucursal.id = :idSucursal)
        AND (:nombreInsumo IS NULL OR LOWER(si.articuloInsumo.denominacion) LIKE %:nombreInsumo%)
        AND (:stockMin IS FALSE OR si.stockActual < si.stockMinimo)
        AND (:stockMax IS FALSE OR si.stockActual > si.stockMaximo)
    """)
    Page<SucursalInsumo> filtrarStock(@Param("idSucursal") Long idSucursal,
                                      @Param("nombreInsumo") String nombreInsumo,
                                      @Param("stockMin") boolean stockActualMenorAStockMinimo,
                                      @Param("stockMax") boolean stockActualMayorAStockMaximo,
                                      Pageable pageable);
}