package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.DomicilioDTO;
import com.lab4.buen_sabor_backend.mapper.DomicilioMapper;
import com.lab4.buen_sabor_backend.model.Domicilio;
import com.lab4.buen_sabor_backend.service.DomicilioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/domicilio")
@CrossOrigin(origins = "*")
@Tag(name = "Domicilio", description = "Operaciones relacionadas a domicilios")
public class DomicilioController extends MasterControllerImpl<Domicilio, DomicilioDTO, Long> implements MasterController<DomicilioDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(DomicilioController.class);

    private final DomicilioService domicilioService;
    private final DomicilioMapper domicilioMapper;

    @Autowired
    public DomicilioController(DomicilioService domicilioService, DomicilioMapper domicilioMapper) {
        super(domicilioService);
        this.domicilioService = domicilioService;
        this.domicilioMapper = domicilioMapper;
    }

    @Override
    protected Domicilio toEntity(DomicilioDTO dto) {
        return domicilioMapper.toEntity(dto);
    }

    @Override
    protected DomicilioDTO toDTO(Domicilio entity) {
        return domicilioMapper.toDTO(entity);
    }
}
