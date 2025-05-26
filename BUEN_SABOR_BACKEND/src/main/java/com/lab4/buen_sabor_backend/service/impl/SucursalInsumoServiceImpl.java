package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.SucursalInsumo;
import com.lab4.buen_sabor_backend.repository.SucursalInsumoRepository;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SucursalInsumoServiceImpl extends MasterServiceImpl<SucursalInsumo, Long> implements SucursalInsumoService {

    @Autowired
    public SucursalInsumoServiceImpl(SucursalInsumoRepository sucursalInsumoRepository) {
        super(sucursalInsumoRepository);
    }

}