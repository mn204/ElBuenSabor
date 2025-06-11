package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.model.Empleado;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmpleadoRegistroMapper {
    Empleado toEntity(EmpleadoRegistroDTO dto);
    EmpleadoRegistroDTO toDto(Empleado entity);
}
