package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Factura;
import com.lab4.buen_sabor_backend.repository.FacturaRepository;
import com.lab4.buen_sabor_backend.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FacturaServiceImpl extends MasterServiceImpl<Factura, Long> implements FacturaService {

    @Autowired
    public FacturaServiceImpl(FacturaRepository facturaRepository) {
        super(facturaRepository);
    }

}