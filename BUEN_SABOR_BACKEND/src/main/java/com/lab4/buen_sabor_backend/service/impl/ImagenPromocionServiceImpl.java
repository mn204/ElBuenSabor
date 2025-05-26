package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ImagenPromocion;
import com.lab4.buen_sabor_backend.repository.ImagenPromocionRepository;
import com.lab4.buen_sabor_backend.service.ImagenPromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenPromocionServiceImpl extends MasterServiceImpl<ImagenPromocion, Long> implements ImagenPromocionService {

    @Autowired
    public ImagenPromocionServiceImpl(ImagenPromocionRepository imagenPromocionRepository) {
        super(imagenPromocionRepository);
    }

}