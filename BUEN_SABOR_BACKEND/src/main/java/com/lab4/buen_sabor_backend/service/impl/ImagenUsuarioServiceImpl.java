package com.lab4.buen_sabor_backend.service.impl;
import com.lab4.buen_sabor_backend.model.ImagenUsuario;
import com.lab4.buen_sabor_backend.repository.ImagenUsuarioRepository;
import com.lab4.buen_sabor_backend.service.ImagenUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenUsuarioServiceImpl extends MasterServiceImpl<ImagenUsuario, Long> implements ImagenUsuarioService {

    @Autowired
    public ImagenUsuarioServiceImpl(ImagenUsuarioRepository imagenUsuarioRepository) {
        super(imagenUsuarioRepository);
    }

}