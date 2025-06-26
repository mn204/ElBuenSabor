package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.SucursalInsumo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SucursalInsumoService extends MasterService<SucursalInsumo, Long> {
    SucursalInsumo findBySucursalIdAndArticuloInsumoId(Long sucursalId, Long articuloInsumoId);

    List<SucursalInsumo> obtenerConStockBajo(Long idSucursal);

    SucursalInsumo agregarStock(SucursalInsumo sucursalInsumo);
    List<SucursalInsumo> findBySucursalId(Long sucursalId);

    Page<SucursalInsumo> buscarFiltrado(Long idSucursal,
                                        String nombreInsumo,
                                        boolean stockActualMenorAStockMinimo,
                                        boolean stockActualMayorAStockMaximo,
                                        Pageable pageable);
}