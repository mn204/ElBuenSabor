package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ImagenArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.model.ImagenArticulo;
import com.lab4.buen_sabor_backend.model.ImagenArticuloManufacturado;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ImagenArticuloManufacturadoMapper extends MasterMapper<ImagenArticuloManufacturado, ImagenArticuloManufacturadoDTO> {

    ImagenArticuloManufacturadoDTO toDTO(ImagenArticuloManufacturado source);

    ImagenArticuloManufacturado toEntity(ImagenArticuloManufacturadoDTO source);
}

