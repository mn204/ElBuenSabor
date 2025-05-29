package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.HistoricoPrecioVentaDTO;
import com.lab4.buen_sabor_backend.dto.ImagenArticuloDTO;
import com.lab4.buen_sabor_backend.mapper.ImagenArticuloMapper;
import com.lab4.buen_sabor_backend.model.ImagenArticulo;
import com.lab4.buen_sabor_backend.service.ImagenArticuloService;
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
@RequestMapping("/api/imagenArticulo")
@CrossOrigin(origins = "*")
public class ImagenArticuloController extends MasterControllerImpl<ImagenArticulo, ImagenArticuloDTO, Long> implements MasterController<ImagenArticuloDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ImagenArticuloController.class);

    private final ImagenArticuloService ImagenArticuloService;
    private final ImagenArticuloMapper ImagenArticuloMapper;

    @Autowired
    public ImagenArticuloController(ImagenArticuloService ImagenArticuloService, ImagenArticuloMapper ImagenArticuloMapper) {
        super(ImagenArticuloService);
        this.ImagenArticuloService = ImagenArticuloService;
        this.ImagenArticuloMapper = ImagenArticuloMapper;
    }

    @Override
    protected ImagenArticulo toEntity(ImagenArticuloDTO dto) {
        return ImagenArticuloMapper.toEntity(dto);
    }

    @Override
    protected ImagenArticuloDTO toDTO(ImagenArticulo entity) {
        return ImagenArticuloMapper.toDTO(entity);
    }
}