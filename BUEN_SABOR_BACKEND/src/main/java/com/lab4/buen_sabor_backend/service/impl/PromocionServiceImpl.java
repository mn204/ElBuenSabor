package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.repository.PromocionRepository;

import com.lab4.buen_sabor_backend.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromocionServiceImpl extends MasterServiceImpl<Promocion, Long> implements PromocionService {

    @Autowired
    public PromocionServiceImpl(PromocionRepository promocionRepository) {
        super(promocionRepository);
    }

}