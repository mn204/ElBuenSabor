package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.SucursalDTO;
import com.lab4.buen_sabor_backend.mapper.SucursalMapper;
import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.service.SucursalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sucursal")
@CrossOrigin(origins = "*")
public class SucursalController extends MasterControllerImpl<Sucursal, SucursalDTO, Long> implements MasterController<SucursalDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(SucursalController.class);

    private final SucursalService sucursalService;
    private final SucursalMapper sucursalMapper;

    @Autowired
    public SucursalController(SucursalService sucursalService, SucursalMapper sucursalMapper) {
        super(sucursalService);
        this.sucursalService = sucursalService;
        this.sucursalMapper = sucursalMapper;
    }

    @Override
    protected Sucursal toEntity(SucursalDTO dto) {
        return sucursalMapper.toEntity(dto);
    }

    @Override
    protected SucursalDTO toDTO(Sucursal entity) {
        return sucursalMapper.toDTO(entity);
    }
}
