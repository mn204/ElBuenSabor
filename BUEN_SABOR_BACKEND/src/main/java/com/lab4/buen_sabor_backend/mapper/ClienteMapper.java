package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.model.Cliente;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClienteMapper extends MasterMapper<Cliente, ClienteDTO> {

    ClienteDTO toDTO(Cliente source);

    Cliente toEntity(ClienteDTO source);
}

