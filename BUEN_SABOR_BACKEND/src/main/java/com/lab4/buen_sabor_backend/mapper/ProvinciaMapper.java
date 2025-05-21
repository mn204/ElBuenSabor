package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ProvinciaDTO;
import com.lab4.buen_sabor_backend.model.Provincia;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProvinciaMapper extends MasterMapper<Provincia, ProvinciaDTO> {

    ProvinciaDTO toDTO(Provincia source);
    Provincia toEntity(ProvinciaDTO source);
}

