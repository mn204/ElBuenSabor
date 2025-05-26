package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.HistoricoPrecioVenta;
import com.lab4.buen_sabor_backend.repository.HistoricoPrecioVentaRepository;
import com.lab4.buen_sabor_backend.service.HistoricoPrecioVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoricoPrecioVentaServiceImpl extends MasterServiceImpl<HistoricoPrecioVenta, Long> implements HistoricoPrecioVentaService {

    @Autowired
    public HistoricoPrecioVentaServiceImpl(HistoricoPrecioVentaRepository historicoPrecioVentaRepository) {
        super(historicoPrecioVentaRepository);
    }

}