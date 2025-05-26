package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.DetallePromocion;
import com.lab4.buen_sabor_backend.repository.DetallePromocionRepository;
import com.lab4.buen_sabor_backend.service.DetallePromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetallePromocionServiceImpl extends MasterServiceImpl<DetallePromocion, Long> implements DetallePromocionService {

    @Autowired
    public DetallePromocionServiceImpl(DetallePromocionRepository detallePromocionRepository) {
        super(detallePromocionRepository);
    }

}