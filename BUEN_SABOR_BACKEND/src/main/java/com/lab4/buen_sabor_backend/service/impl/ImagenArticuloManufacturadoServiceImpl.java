package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ImagenArticuloManufacturado;
import com.lab4.buen_sabor_backend.repository.ImagenArticuloManufacturadoRepository;
import com.lab4.buen_sabor_backend.service.ImagenArticuloManufacturadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class ImagenArticuloManufacturadoServiceImpl extends MasterServiceImpl<ImagenArticuloManufacturado, Long> implements ImagenArticuloManufacturadoService {
    private static final Logger logger = LoggerFactory.getLogger(ArticuloManufacturadoServiceImpl.class);
    private final ImagenArticuloManufacturadoRepository imagenArticuloManufacturadoRepository;
    @Autowired
    public ImagenArticuloManufacturadoServiceImpl(ImagenArticuloManufacturadoRepository imagenArticuloManufacturadoRepository, ImagenArticuloManufacturadoRepository imagenArticuloManufacturadoRepository1) {
        super(imagenArticuloManufacturadoRepository);
        this.imagenArticuloManufacturadoRepository = imagenArticuloManufacturadoRepository1;
    }

    @Override
    public List<ImagenArticuloManufacturado> findAllByProductoId(Long productoId) {
        logger.info("Buscando imagen del porducto con ID: {}", productoId);
        return imagenArticuloManufacturadoRepository.findAllByArticuloManufacturadoId(productoId);
    }
}