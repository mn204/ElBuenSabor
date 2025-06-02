package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ImagenPromocionDTO;
import com.lab4.buen_sabor_backend.mapper.ImagenPromocionMapper;
import com.lab4.buen_sabor_backend.model.ImagenPromocion;
import com.lab4.buen_sabor_backend.service.ImagenPromocionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/imagen-promocion")
@CrossOrigin(origins = "*")
public class ImagenPromocionController extends MasterControllerImpl<ImagenPromocion, ImagenPromocionDTO, Long> implements MasterController<ImagenPromocionDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ImagenPromocionController.class);

    private final ImagenPromocionService imagenPromocionService;
    private final ImagenPromocionMapper imagenPromocionMapper;

    @Autowired
    public ImagenPromocionController(ImagenPromocionService imagenPromocionService, ImagenPromocionMapper imagenPromocionMapper) {
        super(imagenPromocionService);
        this.imagenPromocionService = imagenPromocionService;
        this.imagenPromocionMapper = imagenPromocionMapper;
    }

    @Override
    protected ImagenPromocion toEntity(ImagenPromocionDTO dto) {
        return imagenPromocionMapper.toEntity(dto);
    }

    @Override
    protected ImagenPromocionDTO toDTO(ImagenPromocion entity) {
        return imagenPromocionMapper.toDTO(entity);
    }
}