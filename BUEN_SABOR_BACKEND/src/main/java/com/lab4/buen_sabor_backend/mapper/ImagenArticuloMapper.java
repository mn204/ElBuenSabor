package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ImagenArticuloDTO;
import com.lab4.buen_sabor_backend.model.ImagenArticulo;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ImagenArticuloMapper extends MasterMapper<ImagenArticulo, ImagenArticuloDTO> {

    ImagenArticuloDTO toDTO(ImagenArticulo source);
    ImagenArticulo toEntity(ImagenArticuloDTO source);
}

