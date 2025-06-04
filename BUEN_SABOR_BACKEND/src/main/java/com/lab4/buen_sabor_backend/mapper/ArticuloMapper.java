package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ArticuloDTO;
import com.lab4.buen_sabor_backend.model.Articulo;
import org.mapstruct.*;

import java.util.*;

@Mapper(componentModel = "spring")
public interface ArticuloMapper extends MasterMapper<Articulo, ArticuloDTO> {

    ArticuloDTO toDTO(Articulo source);

    Articulo toEntity(ArticuloDTO source);

    @Override
    List<ArticuloDTO> toDTOsList(List<Articulo> source);

    @Override
    List<Articulo> toEntitiesList(List<ArticuloDTO> source);
}
