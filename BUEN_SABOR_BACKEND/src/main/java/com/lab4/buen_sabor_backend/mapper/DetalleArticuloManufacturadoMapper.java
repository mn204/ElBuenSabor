package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.DetalleArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.model.DetalleArticuloManufacturado;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DetalleArticuloManufacturadoMapper extends MasterMapper<DetalleArticuloManufacturado, DetalleArticuloManufacturadoDTO> {

    DetalleArticuloManufacturadoDTO toDTO(DetalleArticuloManufacturado source);

    DetalleArticuloManufacturado toEntity(DetalleArticuloManufacturadoDTO source);
}

