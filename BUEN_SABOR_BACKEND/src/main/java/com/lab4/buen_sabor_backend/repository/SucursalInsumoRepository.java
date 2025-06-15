package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.SucursalInsumo;
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
}