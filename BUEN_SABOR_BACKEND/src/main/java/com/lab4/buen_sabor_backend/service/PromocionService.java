package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.Sucursal;

import java.util.List;

public interface PromocionService extends MasterService<Promocion, Long> {
    boolean existsById(Long id);
    List<Promocion> findPromocionsBySucursal(Sucursal sucursal);

}