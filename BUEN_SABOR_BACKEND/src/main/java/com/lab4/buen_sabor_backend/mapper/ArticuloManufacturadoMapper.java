package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ArticuloManufacturadoMapper extends MasterMapper<ArticuloManufacturado, ArticuloManufacturadoDTO> {

    ArticuloManufacturadoDTO toDTO(ArticuloManufacturado source);

    ArticuloManufacturado toEntity(ArticuloManufacturadoDTO source);
}

