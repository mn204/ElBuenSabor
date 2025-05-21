package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ImagenPromocionDTO;
import com.lab4.buen_sabor_backend.model.ImagenPromocion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagenPromocionMapper extends MasterMapper<ImagenPromocion, ImagenPromocionDTO>{
}
