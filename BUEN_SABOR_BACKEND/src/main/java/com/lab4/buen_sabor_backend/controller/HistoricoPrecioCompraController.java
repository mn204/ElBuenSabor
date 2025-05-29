package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.DetalleArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.dto.HistoricoPrecioCompraDTO;
import com.lab4.buen_sabor_backend.mapper.HistoricoPrecioCompraMapper;
import com.lab4.buen_sabor_backend.model.HistoricoPrecioCompra;
import com.lab4.buen_sabor_backend.service.HistoricoPrecioCompraService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/historicoCompra")
@CrossOrigin(origins = "*")
public class HistoricoPrecioCompraController extends MasterControllerImpl<HistoricoPrecioCompra, HistoricoPrecioCompraDTO, Long> implements MasterController<HistoricoPrecioCompraDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(HistoricoPrecioCompraController.class);

    private final HistoricoPrecioCompraService HistoricoPrecioCompraService;
    private final HistoricoPrecioCompraMapper HistoricoPrecioCompraMapper;

    @Autowired
    public HistoricoPrecioCompraController(HistoricoPrecioCompraService HistoricoPrecioCompraService, HistoricoPrecioCompraMapper HistoricoPrecioCompraMapper) {
        super(HistoricoPrecioCompraService);
        this.HistoricoPrecioCompraService = HistoricoPrecioCompraService;
        this.HistoricoPrecioCompraMapper = HistoricoPrecioCompraMapper;
    }

    @Override
    protected HistoricoPrecioCompra toEntity(HistoricoPrecioCompraDTO dto) {
        return HistoricoPrecioCompraMapper.toEntity(dto);
    }

    @Override
    protected HistoricoPrecioCompraDTO toDTO(HistoricoPrecioCompra entity) {
        return HistoricoPrecioCompraMapper.toDTO(entity);
    }
}
