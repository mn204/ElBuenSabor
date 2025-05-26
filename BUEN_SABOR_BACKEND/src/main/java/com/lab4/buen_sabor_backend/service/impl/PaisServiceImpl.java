package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Pais;
import com.lab4.buen_sabor_backend.repository.PaisRepository;
import com.lab4.buen_sabor_backend.service.PaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaisServiceImpl extends MasterServiceImpl<Pais, Long> implements PaisService {

    @Autowired
    public PaisServiceImpl(PaisRepository paisRepository) {
        super(paisRepository);
    }

}