package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ProvinciaDTO;
import com.lab4.buen_sabor_backend.mapper.ProvinciaMapper;
import com.lab4.buen_sabor_backend.model.Provincia;
import com.lab4.buen_sabor_backend.service.ProvinciaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/provincia")
@CrossOrigin(origins = "*")
@Tag(name = "Provincia", description = "Operaciones relacionadas con provincias")
public class ProvinciaController extends MasterControllerImpl<Provincia, ProvinciaDTO, Long> implements MasterController<ProvinciaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ProvinciaController.class);

    private final ProvinciaService provinciaService;
    private final ProvinciaMapper provinciaMapper;

    @Autowired
    public ProvinciaController(ProvinciaService provinciaService, ProvinciaMapper provinciaMapper) {
        super(provinciaService);
        this.provinciaService = provinciaService;
        this.provinciaMapper = provinciaMapper;
    }

    @Override
    protected Provincia toEntity(ProvinciaDTO dto) {
        return provinciaMapper.toEntity(dto);
    }

    @Override
    protected ProvinciaDTO toDTO(Provincia entity) {
        return provinciaMapper.toDTO(entity);
    }
}
