package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.SucursalInsumoDTO;
import com.lab4.buen_sabor_backend.model.SucursalInsumo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SucursalInsumoMapper extends MasterMapper<SucursalInsumo, SucursalInsumoDTO> {

    SucursalInsumoDTO toDTO(SucursalInsumo source);
    SucursalInsumo toEntity(SucursalInsumoDTO source);
}
