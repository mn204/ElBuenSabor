package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.UsuarioDTO;
import com.lab4.buen_sabor_backend.model.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper extends MasterMapper<Usuario, UsuarioDTO>{
}
