package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ExistenciaDTO;
import com.lab4.buen_sabor_backend.model.Existencia;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ExistenciaMapper extends MasterMapper<Existencia, ExistenciaDTO> {
    ExistenciaDTO toDTO(Existencia source);
    Existencia toEntity(ExistenciaDTO source);
}

