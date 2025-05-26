package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.HistoricoPrecioCompra;
import com.lab4.buen_sabor_backend.repository.HistoricoPrecioCompraRepository;
import com.lab4.buen_sabor_backend.service.HistoricoPrecioCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoricoPrecioCompraServiceImpl extends MasterServiceImpl<HistoricoPrecioCompra, Long> implements HistoricoPrecioCompraService {

    @Autowired
    public HistoricoPrecioCompraServiceImpl(HistoricoPrecioCompraRepository historicoPrecioCompraRepository) {
        super(historicoPrecioCompraRepository);
    }

}