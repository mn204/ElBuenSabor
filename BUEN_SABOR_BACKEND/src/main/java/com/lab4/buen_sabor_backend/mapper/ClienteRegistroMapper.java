package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ClienteRegistroDTO;
import com.lab4.buen_sabor_backend.model.Cliente;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClienteRegistroMapper {
    Cliente toEntity(ClienteRegistroDTO source);
}
