package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Provincia;
import com.lab4.buen_sabor_backend.repository.ProvinciaRepository;
import com.lab4.buen_sabor_backend.service.ProvinciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProvinciaServiceImpl extends MasterServiceImpl<Provincia, Long> implements ProvinciaService {

    @Autowired
    public ProvinciaServiceImpl(ProvinciaRepository provinciaRepository) {
        super(provinciaRepository);
    }

}