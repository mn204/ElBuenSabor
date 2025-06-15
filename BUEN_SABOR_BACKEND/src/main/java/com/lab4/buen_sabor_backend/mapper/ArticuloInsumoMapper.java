package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ArticuloInsumoDTO;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import org.mapstruct.*;

import java.util.*;

@Mapper(componentModel = "spring", uses = {ArticuloInsumoMapper.class})
public interface ArticuloInsumoMapper extends MasterMapper<ArticuloInsumo, ArticuloInsumoDTO> {

    ArticuloInsumoDTO toDTO(ArticuloInsumo source);
    
    ArticuloInsumo toEntity(ArticuloInsumoDTO source);

    @Override
    List<ArticuloInsumoDTO> toDTOsList(List<ArticuloInsumo> source);

    @Override
    List<ArticuloInsumo> toEntitiesList(List<ArticuloInsumoDTO> source);
}

