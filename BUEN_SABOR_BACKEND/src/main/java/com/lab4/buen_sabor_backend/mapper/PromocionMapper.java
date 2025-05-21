package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.PromocionDTO;
import com.lab4.buen_sabor_backend.model.Promocion;
import org.mapstruct.*;


@Mapper(componentModel = "spring")
public interface PromocionMapper extends MasterMapper<Promocion, PromocionDTO> {
    PromocionDTO toDTO(Promocion source);
    Promocion toEntity(PromocionDTO source);
}

