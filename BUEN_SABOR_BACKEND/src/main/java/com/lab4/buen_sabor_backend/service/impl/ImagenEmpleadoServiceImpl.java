package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ImagenEmpleado;
import com.lab4.buen_sabor_backend.repository.ImagenEmpleadoRepository;
import com.lab4.buen_sabor_backend.service.ImagenEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenEmpleadoServiceImpl extends MasterServiceImpl<ImagenEmpleado, Long> implements ImagenEmpleadoService {

    @Autowired
    public ImagenEmpleadoServiceImpl(ImagenEmpleadoRepository imagenEmpleadoRepository) {
        super(imagenEmpleadoRepository);
    }

}