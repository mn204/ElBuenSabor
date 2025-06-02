package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ImagenUsuarioDTO;
import com.lab4.buen_sabor_backend.mapper.ImagenUsuarioMapper;
import com.lab4.buen_sabor_backend.model.ImagenUsuario;
import com.lab4.buen_sabor_backend.service.ImagenUsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/imagen-usuario")
@CrossOrigin(origins = "*")
public class ImagenUsuarioController extends MasterControllerImpl<ImagenUsuario, ImagenUsuarioDTO, Long> implements MasterController<ImagenUsuarioDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ImagenUsuarioController.class);

    private final ImagenUsuarioService imagenUsuarioService;
    private final ImagenUsuarioMapper imagenUsuarioMapper;

    @Autowired
    public ImagenUsuarioController(ImagenUsuarioService imagenUsuarioService, ImagenUsuarioMapper imagenUsuarioMapper) {
        super(imagenUsuarioService);
        this.imagenUsuarioService = imagenUsuarioService;
        this.imagenUsuarioMapper = imagenUsuarioMapper;
    }

    @Override
    protected ImagenUsuario toEntity(ImagenUsuarioDTO dto) {
        return imagenUsuarioMapper.toEntity(dto);
    }

    @Override
    protected ImagenUsuarioDTO toDTO(ImagenUsuario entity) {
        return imagenUsuarioMapper.toDTO(entity);
    }
}
