package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.UnidadMedida;
import com.lab4.buen_sabor_backend.repository.UnidadMedidaRepository;
import com.lab4.buen_sabor_backend.service.UnidadMedidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnidadMedidaServiceImpl extends MasterServiceImpl<UnidadMedida, Long> implements UnidadMedidaService {

    @Autowired
    public UnidadMedidaServiceImpl(UnidadMedidaRepository unidadMedidaRepository) {
        super(unidadMedidaRepository);
    }

}