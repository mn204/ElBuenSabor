package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.DetallePromocionDTO;
import com.lab4.buen_sabor_backend.model.DetallePromocion;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DetallePromocionMapper extends MasterMapper<DetallePromocion, DetallePromocionDTO> {
    DetallePromocionDTO toDTO(DetallePromocion source);
    @Mappings({
            @Mapping(target = "articulo", ignore = true)
    })
    DetallePromocion toEntity(DetallePromocionDTO source);
}

