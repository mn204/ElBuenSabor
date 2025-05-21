package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ImagenClienteDTO;
import com.lab4.buen_sabor_backend.model.ImagenCliente;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagenClienteMapper extends MasterMapper<ImagenCliente, ImagenClienteDTO> {
}
