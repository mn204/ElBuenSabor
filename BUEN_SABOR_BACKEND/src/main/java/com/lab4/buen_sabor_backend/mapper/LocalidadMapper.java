package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.LocalidadDTO;
import com.lab4.buen_sabor_backend.model.Localidad;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LocalidadMapper extends MasterMapper<Localidad, LocalidadDTO> {

    LocalidadDTO toDTO(Localidad source);
    Localidad toEntity(LocalidadDTO source);
}

