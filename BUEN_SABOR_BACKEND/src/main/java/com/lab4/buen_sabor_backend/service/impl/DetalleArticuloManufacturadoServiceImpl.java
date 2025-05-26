package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.DetalleArticuloManufacturado;
import com.lab4.buen_sabor_backend.repository.DetalleArticuloManufacturadoRepository;
import com.lab4.buen_sabor_backend.service.DetalleArticuloManufacturadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleArticuloManufacturadoServiceImpl extends MasterServiceImpl<DetalleArticuloManufacturado, Long> implements DetalleArticuloManufacturadoService {

    @Autowired
    public DetalleArticuloManufacturadoServiceImpl(DetalleArticuloManufacturadoRepository detalleArticuloManufacturadoRepository) {
        super(detalleArticuloManufacturadoRepository);
    }

}