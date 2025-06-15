package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.SucursalInsumoDTO;
import com.lab4.buen_sabor_backend.mapper.SucursalInsumoMapper;
import com.lab4.buen_sabor_backend.model.SucursalInsumo;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sucursal-insumo")
@CrossOrigin(origins = "*")
public class SucursalInsumoController extends MasterControllerImpl<SucursalInsumo, SucursalInsumoDTO, Long> implements MasterController<SucursalInsumoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(SucursalInsumoController.class);

    private final SucursalInsumoService sucursalInsumoService;
    private final SucursalInsumoMapper sucursalInsumoMapper;

    @Autowired
    public SucursalInsumoController(SucursalInsumoService sucursalInsumoService, SucursalInsumoMapper sucursalInsumoMapper) {
        super(sucursalInsumoService);
        this.sucursalInsumoService = sucursalInsumoService;
        this.sucursalInsumoMapper = sucursalInsumoMapper;
    }

    @Override
    protected SucursalInsumo toEntity(SucursalInsumoDTO dto) {
        return sucursalInsumoMapper.toEntity(dto);
    }

    @Override
    protected SucursalInsumoDTO toDTO(SucursalInsumo entity) {
        return sucursalInsumoMapper.toDTO(entity);
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<SucursalInsumoDTO>> getStockBajo(@RequestParam(required = false) Long idSucursal) {
        List<SucursalInsumo> sucursalInsumos = sucursalInsumoService.obtenerConStockBajo(idSucursal);
        List<SucursalInsumoDTO> sucursalInsumosDTO = sucursalInsumoMapper.toDTOsList(sucursalInsumos);
        return ResponseEntity.ok(sucursalInsumosDTO);
    }
}
