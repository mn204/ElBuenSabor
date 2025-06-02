package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.EmpresaDTO;
import com.lab4.buen_sabor_backend.mapper.EmpresaMapper;
import com.lab4.buen_sabor_backend.model.Empresa;
import com.lab4.buen_sabor_backend.service.EmpresaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/empresa")
@CrossOrigin(origins = "*")
public class EmpresaController extends MasterControllerImpl<Empresa, EmpresaDTO, Long> implements MasterController<EmpresaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(EmpresaController.class);

    private final EmpresaService empresaService;
    private final EmpresaMapper empresaMapper;

    @Autowired
    public EmpresaController(EmpresaService empresaService, EmpresaMapper empresaMapper) {
        super(empresaService);
        this.empresaService = empresaService;
        this.empresaMapper = empresaMapper;
    }

    @Override
    protected Empresa toEntity(EmpresaDTO dto) {
        return empresaMapper.toEntity(dto);
    }

    @Override
    protected EmpresaDTO toDTO(Empresa entity) {
        return empresaMapper.toDTO(entity);
    }
}