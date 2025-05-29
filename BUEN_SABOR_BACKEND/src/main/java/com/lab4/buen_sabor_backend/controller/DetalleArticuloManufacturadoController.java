package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.CategoriaDTO;
import com.lab4.buen_sabor_backend.dto.DetalleArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.mapper.DetalleArticuloManufacturadoMapper;
import com.lab4.buen_sabor_backend.model.DetalleArticuloManufacturado;
import com.lab4.buen_sabor_backend.service.DetalleArticuloManufacturadoService;
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
@RequestMapping("/api/detalleArticulo")
@CrossOrigin(origins = "*")
public class DetalleArticuloManufacturadoController extends MasterControllerImpl<DetalleArticuloManufacturado, DetalleArticuloManufacturadoDTO, Long> implements MasterController<DetalleArticuloManufacturadoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(DetalleArticuloManufacturadoController.class);

    private final DetalleArticuloManufacturadoService DetalleArticuloManufacturadoService;
    private final DetalleArticuloManufacturadoMapper DetalleArticuloManufacturadoMapper;

    @Autowired
    public DetalleArticuloManufacturadoController(DetalleArticuloManufacturadoService DetalleArticuloManufacturadoService, DetalleArticuloManufacturadoMapper DetalleArticuloManufacturadoMapper) {
        super(DetalleArticuloManufacturadoService);
        this.DetalleArticuloManufacturadoService = DetalleArticuloManufacturadoService;
        this.DetalleArticuloManufacturadoMapper = DetalleArticuloManufacturadoMapper;
    }

    @Override
    protected DetalleArticuloManufacturado toEntity(DetalleArticuloManufacturadoDTO dto) {
        return DetalleArticuloManufacturadoMapper.toEntity(dto);
    }

    @Override
    protected DetalleArticuloManufacturadoDTO toDTO(DetalleArticuloManufacturado entity) {
        return DetalleArticuloManufacturadoMapper.toDTO(entity);
    }
}