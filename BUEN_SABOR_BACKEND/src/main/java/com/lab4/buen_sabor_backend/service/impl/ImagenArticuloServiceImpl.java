package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ImagenArticulo;
import com.lab4.buen_sabor_backend.repository.ImagenArticuloRepository;
import com.lab4.buen_sabor_backend.service.ImagenArticuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenArticuloServiceImpl extends MasterServiceImpl<ImagenArticulo, Long> implements ImagenArticuloService {

    @Autowired
    public ImagenArticuloServiceImpl(ImagenArticuloRepository imagenArticuloRepository) {
        super(imagenArticuloRepository);
    }

}