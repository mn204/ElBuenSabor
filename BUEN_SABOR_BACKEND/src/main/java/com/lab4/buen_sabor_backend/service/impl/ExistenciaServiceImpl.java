package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Existencia;
import com.lab4.buen_sabor_backend.repository.ExistenciaRepository;
import com.lab4.buen_sabor_backend.service.ExistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExistenciaServiceImpl extends MasterServiceImpl<Existencia, Long> implements ExistenciaService {

    @Autowired
    public ExistenciaServiceImpl(ExistenciaRepository existenciaRepository) {
        super(existenciaRepository);
    }

}