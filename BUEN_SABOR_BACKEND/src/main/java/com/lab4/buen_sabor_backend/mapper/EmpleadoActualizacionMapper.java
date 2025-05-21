package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.EmpleadoActualizacionDTO;
import com.lab4.buen_sabor_backend.model.Empleado;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmpleadoActualizacionMapper {
    Empleado toEntity(EmpleadoActualizacionDTO dto);
    EmpleadoActualizacionDTO toDto(Empleado entity);
}