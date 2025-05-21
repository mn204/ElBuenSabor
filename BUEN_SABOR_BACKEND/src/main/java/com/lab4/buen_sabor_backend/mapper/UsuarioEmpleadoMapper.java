package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.UsuarioEmpleadoDTO;
import com.lab4.buen_sabor_backend.model.UsuarioEmpleado;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioEmpleadoMapper extends MasterMapper<UsuarioEmpleado, UsuarioEmpleadoDTO> {
}

