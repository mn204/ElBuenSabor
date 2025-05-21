package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.DomicilioDTO;
import com.lab4.buen_sabor_backend.model.Domicilio;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DomicilioMapper extends MasterMapper<Domicilio, DomicilioDTO> {
    DomicilioDTO toDTO(Domicilio source);

    Domicilio toEntity(DomicilioDTO source);

    @Override
    List<DomicilioDTO> toDTOsList(List<Domicilio> source);

    @Override
    List<Domicilio> toEntitiesList(List<DomicilioDTO> source);
}
