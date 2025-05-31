package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.dto.ImagenArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.mapper.ImagenArticuloManufacturadoMapper;
import com.lab4.buen_sabor_backend.model.ImagenArticuloManufacturado;
import com.lab4.buen_sabor_backend.service.ImagenArticuloManufacturadoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/imagenArticuloManu")
@CrossOrigin(origins = "*")
public class ImagenArticuloManufacturadoController extends MasterControllerImpl<ImagenArticuloManufacturado, ImagenArticuloManufacturadoDTO, Long> implements MasterController<ImagenArticuloManufacturadoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ImagenArticuloManufacturadoController.class);

    private final ImagenArticuloManufacturadoService ImagenArticuloManufacturadoService;
    private final ImagenArticuloManufacturadoMapper ImagenArticuloManufacturadoMapper;
    private final ImagenArticuloManufacturadoService imagenArticuloManufacturadoService;

    @Autowired
    public ImagenArticuloManufacturadoController(ImagenArticuloManufacturadoService ImagenArticuloManufacturadoService, ImagenArticuloManufacturadoMapper ImagenArticuloManufacturadoMapper, ImagenArticuloManufacturadoService imagenArticuloManufacturadoService) {
        super(ImagenArticuloManufacturadoService);
        this.ImagenArticuloManufacturadoService = ImagenArticuloManufacturadoService;
        this.ImagenArticuloManufacturadoMapper = ImagenArticuloManufacturadoMapper;
        this.imagenArticuloManufacturadoService = imagenArticuloManufacturadoService;
    }

    @Override
    protected ImagenArticuloManufacturado toEntity(ImagenArticuloManufacturadoDTO dto) {
        return ImagenArticuloManufacturadoMapper.toEntity(dto);
    }

    @Override
    protected ImagenArticuloManufacturadoDTO toDTO(ImagenArticuloManufacturado entity) {
        return ImagenArticuloManufacturadoMapper.toDTO(entity);
    }

    @GetMapping("/existe/{id}")
    public ResponseEntity<List<ImagenArticuloManufacturadoDTO>> findByAritucloManufacturadoId(@PathVariable Long id){
        logger.info("Buscando productos por denominación: {}", id);
        List<ImagenArticuloManufacturadoDTO> imagenes = imagenArticuloManufacturadoService.findAllByProductoId(id)
                .stream()
                .map(ImagenArticuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(imagenes);
    }
}