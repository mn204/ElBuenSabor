package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.FacturaDTO;
import com.lab4.buen_sabor_backend.mapper.FacturaMapper;
import com.lab4.buen_sabor_backend.model.Factura;
import com.lab4.buen_sabor_backend.service.FacturaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/factura")
@CrossOrigin(origins = "*")
public class FacturaController extends MasterControllerImpl<Factura, FacturaDTO, Long> implements MasterController<FacturaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(FacturaController.class);

    private final FacturaService facturaService;
    private final FacturaMapper facturaMapper;

    @Autowired
    public FacturaController(FacturaService facturaService, FacturaMapper facturaMapper) {
        super(facturaService);
        this.facturaService = facturaService;
        this.facturaMapper = facturaMapper;
    }

    @Override
    protected Factura toEntity(FacturaDTO dto) {
        return facturaMapper.toEntity(dto);
    }

    @Override
    protected FacturaDTO toDTO(Factura entity) {
        return facturaMapper.toDTO(entity);
    }
}
