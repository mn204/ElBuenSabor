package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ImagenUsuarioDTO;
import com.lab4.buen_sabor_backend.model.ImagenUsuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagenUsuarioMapper extends MasterMapper<ImagenUsuario, ImagenUsuarioDTO>{
}