package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.SucursalInsumo;

public interface SucursalInsumoService extends MasterService<SucursalInsumo, Long> {
    SucursalInsumo findBySucursalIdAndArticuloInsumoId(Long sucursalId, Long articuloInsumoId);
}