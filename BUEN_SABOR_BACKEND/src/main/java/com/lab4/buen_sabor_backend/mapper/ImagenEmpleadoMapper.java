package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ImagenEmpleadoDTO;
import com.lab4.buen_sabor_backend.model.ImagenEmpleado;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagenEmpleadoMapper extends MasterMapper<ImagenEmpleado, ImagenEmpleadoDTO> {
}

