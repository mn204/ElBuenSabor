package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PaisDTO;
import com.lab4.buen_sabor_backend.mapper.PaisMapper;
import com.lab4.buen_sabor_backend.model.Pais;
import com.lab4.buen_sabor_backend.service.PaisService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pais")
@CrossOrigin(origins = "*")
@Tag(name = "País", description = "Operaciones relacionadas con países")
public class PaisController extends MasterControllerImpl<Pais, PaisDTO, Long> implements MasterController<PaisDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(PaisController.class);

    private final PaisService paisService;
    private final PaisMapper paisMapper;

    @Autowired
    public PaisController(PaisService paisService, PaisMapper paisMapper) {
        super(paisService);
        this.paisService = paisService;
        this.paisMapper = paisMapper;
    }

    @Override
    protected Pais toEntity(PaisDTO dto) {
        return paisMapper.toEntity(dto);
    }

    @Override
    protected PaisDTO toDTO(Pais entity) {
        return paisMapper.toDTO(entity);
    }
}
