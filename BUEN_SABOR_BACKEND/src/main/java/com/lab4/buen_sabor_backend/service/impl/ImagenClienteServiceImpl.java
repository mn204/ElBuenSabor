package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ImagenCliente;
import com.lab4.buen_sabor_backend.repository.ImagenClienteRepository;
import com.lab4.buen_sabor_backend.service.ImagenClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenClienteServiceImpl extends MasterServiceImpl<ImagenCliente, Long> implements ImagenClienteService {

    @Autowired
    public ImagenClienteServiceImpl(ImagenClienteRepository imagenClienteRepository) {
        super(imagenClienteRepository);
    }

}