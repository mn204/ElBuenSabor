package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.PaisDTO;
import com.lab4.buen_sabor_backend.model.Pais;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaisMapper extends MasterMapper<Pais, PaisDTO> {
}

