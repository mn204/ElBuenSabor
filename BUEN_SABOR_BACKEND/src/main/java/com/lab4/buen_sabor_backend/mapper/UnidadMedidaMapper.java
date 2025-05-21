package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.UnidadMedidaDTO;
import com.lab4.buen_sabor_backend.model.UnidadMedida;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UnidadMedidaMapper extends MasterMapper<UnidadMedida, UnidadMedidaDTO> {
}
