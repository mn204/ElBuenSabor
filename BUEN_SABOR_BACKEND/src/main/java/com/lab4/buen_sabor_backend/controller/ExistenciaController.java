package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ExistenciaDTO;
import com.lab4.buen_sabor_backend.mapper.ExistenciaMapper;
import com.lab4.buen_sabor_backend.model.Existencia;
import com.lab4.buen_sabor_backend.service.ExistenciaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/existencia")
@CrossOrigin(origins = "*")
public class ExistenciaController extends MasterControllerImpl<Existencia, ExistenciaDTO, Long> implements MasterController<ExistenciaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ExistenciaController.class);

    private final ExistenciaService existenciaService;
    private final ExistenciaMapper existenciaMapper;

    @Autowired
    public ExistenciaController(ExistenciaService existenciaService, ExistenciaMapper existenciaMapper) {
        super(existenciaService);
        this.existenciaService = existenciaService;
        this.existenciaMapper = existenciaMapper;
    }

    @Override
    protected Existencia toEntity(ExistenciaDTO dto) {
        return existenciaMapper.toEntity(dto);
    }

    @Override
    protected ExistenciaDTO toDTO(Existencia entity) {
        return existenciaMapper.toDTO(entity);
    }
}
