package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.DetallePromocionDTO;
import com.lab4.buen_sabor_backend.mapper.DetallePromocionMapper;
import com.lab4.buen_sabor_backend.model.DetallePromocion;
import com.lab4.buen_sabor_backend.service.DetallePromocionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/detalle-promocion")
@CrossOrigin(origins = "*")
@Tag(name = "Detalle Promocion", description = "Operaciones de detalles de promociones")
public class DetallePromocionController extends MasterControllerImpl<DetallePromocion, DetallePromocionDTO, Long> implements MasterController<DetallePromocionDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(DetallePromocionController.class);

    private final DetallePromocionService detallePromocionService;
    private final DetallePromocionMapper detallePromocionMapper;

    @Autowired
    public DetallePromocionController(DetallePromocionService detallePromocionService, DetallePromocionMapper detallePromocionMapper) {
        super(detallePromocionService);
        this.detallePromocionService = detallePromocionService;
        this.detallePromocionMapper = detallePromocionMapper;
    }

    @Override
    protected DetallePromocion toEntity(DetallePromocionDTO dto) {
        return detallePromocionMapper.toEntity(dto);
    }

    @Override
    protected DetallePromocionDTO toDTO(DetallePromocion entity) {
        return detallePromocionMapper.toDTO(entity);
    }
}
