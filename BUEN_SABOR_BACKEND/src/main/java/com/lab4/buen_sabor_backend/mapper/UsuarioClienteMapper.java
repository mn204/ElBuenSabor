package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.UsuarioClienteDTO;
import com.lab4.buen_sabor_backend.model.UsuarioCliente;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioClienteMapper extends MasterMapper<UsuarioCliente, UsuarioClienteDTO> {
}
