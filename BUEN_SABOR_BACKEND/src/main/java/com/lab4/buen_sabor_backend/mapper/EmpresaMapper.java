package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.EmpresaDTO;
import com.lab4.buen_sabor_backend.model.Empresa;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EmpresaMapper extends MasterMapper<Empresa, EmpresaDTO> {
    EmpresaDTO toDTO(Empresa source);
    Empresa toEntity(EmpresaDTO source);
}

