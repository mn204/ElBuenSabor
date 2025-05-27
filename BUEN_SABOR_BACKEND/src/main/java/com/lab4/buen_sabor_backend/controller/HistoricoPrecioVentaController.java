package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.HistoricoPrecioVentaDTO;
import com.lab4.buen_sabor_backend.mapper.HistoricoPrecioVentaMapper;
import com.lab4.buen_sabor_backend.model.HistoricoPrecioVenta;
import com.lab4.buen_sabor_backend.service.HistoricoPrecioVentaService;
import com.lab4.buen_sabor_backend.service.HistoricoPrecioVentaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historicoVenta")
@CrossOrigin(origins = "*")
public class HistoricoPrecioVentaController extends MasterControllerImpl<HistoricoPrecioVenta, HistoricoPrecioVentaDTO, Long> implements MasterController<HistoricoPrecioVentaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(HistoricoPrecioVentaController.class);

    private final HistoricoPrecioVentaService HistoricoPrecioVentaService;
    private final HistoricoPrecioVentaMapper HistoricoPrecioVentaMapper;

    @Autowired
    public HistoricoPrecioVentaController(HistoricoPrecioVentaService HistoricoPrecioVentaService, HistoricoPrecioVentaMapper HistoricoPrecioVentaMapper) {
        super(HistoricoPrecioVentaService);
        this.HistoricoPrecioVentaService = HistoricoPrecioVentaService;
        this.HistoricoPrecioVentaMapper = HistoricoPrecioVentaMapper;
    }

    @Override
    protected HistoricoPrecioVenta toEntity(HistoricoPrecioVentaDTO dto) {
        return HistoricoPrecioVentaMapper.toEntity(dto);
    }

    @Override
    protected HistoricoPrecioVentaDTO toDTO(HistoricoPrecioVenta entity) {
        return HistoricoPrecioVentaMapper.toDTO(entity);
    }
}