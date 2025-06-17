package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PromocionDTO;
import com.lab4.buen_sabor_backend.dto.SucursalDTO;
import com.lab4.buen_sabor_backend.mapper.PromocionMapper;
import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.service.PromocionService;
import com.lab4.buen_sabor_backend.service.SucursalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocion")
@CrossOrigin(origins = "*")
public class PromocionController extends MasterControllerImpl<Promocion, PromocionDTO, Long> implements MasterController<PromocionDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(PromocionController.class);

    private final PromocionService promocionService;
    private final SucursalService sucrusalService;
    private final PromocionMapper promocionMapper;

    @Autowired
    public PromocionController(PromocionService promocionService, SucursalService sucrusalService, PromocionMapper promocionMapper) {
        super(promocionService);
        this.promocionService = promocionService;
        this.sucrusalService = sucrusalService;
        this.promocionMapper = promocionMapper;
    }

    @Override
    protected Promocion toEntity(PromocionDTO dto) {
        return promocionMapper.toEntity(dto);
    }

    @Override
    protected PromocionDTO toDTO(Promocion entity) {
        return promocionMapper.toDTO(entity);
    }
}
