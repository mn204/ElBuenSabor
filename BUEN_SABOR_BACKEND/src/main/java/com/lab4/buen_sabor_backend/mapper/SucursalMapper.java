package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.SucursalDTO;
import com.lab4.buen_sabor_backend.model.Sucursal;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SucursalMapper extends MasterMapper<Sucursal, SucursalDTO> {

    SucursalDTO toDTO(Sucursal source);
    Sucursal toEntity(SucursalDTO source);
}

