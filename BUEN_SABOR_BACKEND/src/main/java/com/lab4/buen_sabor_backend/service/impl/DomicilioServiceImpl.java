package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Domicilio;
import com.lab4.buen_sabor_backend.repository.DomicilioRepository;
import com.lab4.buen_sabor_backend.service.DomicilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DomicilioServiceImpl extends MasterServiceImpl<Domicilio, Long> implements DomicilioService {

    @Autowired
    public DomicilioServiceImpl(DomicilioRepository domicilioRepository) {
        super(domicilioRepository);
    }

}