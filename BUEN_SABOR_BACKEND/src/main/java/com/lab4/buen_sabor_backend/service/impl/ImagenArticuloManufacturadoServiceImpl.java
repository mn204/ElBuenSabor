package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ImagenArticuloManufacturado;
import com.lab4.buen_sabor_backend.repository.ImagenArticuloManufacturadoRepository;
import com.lab4.buen_sabor_backend.service.ImagenArticuloManufacturadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenArticuloManufacturadoServiceImpl extends MasterServiceImpl<ImagenArticuloManufacturado, Long> implements ImagenArticuloManufacturadoService {

    @Autowired
    public ImagenArticuloManufacturadoServiceImpl(ImagenArticuloManufacturadoRepository imagenArticuloManufacturadoRepository) {
        super(imagenArticuloManufacturadoRepository);
    }

}