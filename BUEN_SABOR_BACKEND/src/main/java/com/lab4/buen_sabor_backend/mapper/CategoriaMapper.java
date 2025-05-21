package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.CategoriaDTO;
import com.lab4.buen_sabor_backend.model.Categoria;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoriaMapper extends MasterMapper<Categoria, CategoriaDTO> {

    CategoriaDTO toDTO(Categoria source);

    Categoria toEntity(CategoriaDTO source);
}
