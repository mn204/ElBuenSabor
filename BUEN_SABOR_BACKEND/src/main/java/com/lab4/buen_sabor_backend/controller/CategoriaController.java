package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.CategoriaDTO;
import com.lab4.buen_sabor_backend.mapper.CategoriaMapper;
import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController extends MasterControllerImpl<Categoria, CategoriaDTO, Long> implements MasterController<CategoriaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(CategoriaController.class);

    private final CategoriaService CategoriaService;
    private final CategoriaMapper CategoriaMapper;

    @Autowired
    public CategoriaController(CategoriaService CategoriaService, CategoriaMapper CategoriaMapper) {
        super(CategoriaService);
        this.CategoriaService = CategoriaService;
        this.CategoriaMapper = CategoriaMapper;
    }

    @Override
    protected Categoria toEntity(CategoriaDTO dto) {
        return CategoriaMapper.toEntity(dto);
    }

    @Override
    protected CategoriaDTO toDTO(Categoria entity) {
        return CategoriaMapper.toDTO(entity);
    }
}