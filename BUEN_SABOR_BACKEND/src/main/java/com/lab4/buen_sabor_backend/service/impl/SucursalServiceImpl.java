package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.repository.SucursalRepository;
import com.lab4.buen_sabor_backend.service.SucursalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SucursalServiceImpl extends MasterServiceImpl<Sucursal, Long> implements SucursalService {

    @Autowired
    public SucursalServiceImpl(SucursalRepository sucursalRepository) {
        super(sucursalRepository);
    }

}