package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Localidad;
import com.lab4.buen_sabor_backend.repository.LocalidadRepository;
import com.lab4.buen_sabor_backend.service.LocalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocalidadServiceImpl extends MasterServiceImpl<Localidad, Long> implements LocalidadService {

    @Autowired
    public LocalidadServiceImpl(LocalidadRepository localidadReposiroty) {
        super(localidadReposiroty);
    }

}