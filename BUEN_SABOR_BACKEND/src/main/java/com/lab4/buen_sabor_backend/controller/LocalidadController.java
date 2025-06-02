package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.LocalidadDTO;
import com.lab4.buen_sabor_backend.mapper.LocalidadMapper;
import com.lab4.buen_sabor_backend.model.Localidad;
import com.lab4.buen_sabor_backend.service.LocalidadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/localidad")
@CrossOrigin(origins = "*")
public class LocalidadController extends MasterControllerImpl<Localidad, LocalidadDTO, Long> implements MasterController<LocalidadDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(LocalidadController.class);

    private final LocalidadService localidadService;
    private final LocalidadMapper localidadMapper;

    @Autowired
    public LocalidadController(LocalidadService localidadService, LocalidadMapper localidadMapper) {
        super(localidadService);
        this.localidadService = localidadService;
        this.localidadMapper = localidadMapper;
    }

    @Override
    protected Localidad toEntity(LocalidadDTO dto) {
        return localidadMapper.toEntity(dto);
    }

    @Override
    protected LocalidadDTO toDTO(Localidad entity) {
        return localidadMapper.toDTO(entity);
    }
}
