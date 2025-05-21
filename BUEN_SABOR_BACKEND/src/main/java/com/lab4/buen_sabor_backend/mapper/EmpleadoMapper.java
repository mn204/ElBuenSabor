package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.EmpleadoDTO;
import com.lab4.buen_sabor_backend.dto.EmpleadoActualizacionDTO;
import com.lab4.buen_sabor_backend.dto.EmpleadoRegistroDTO;
import com.lab4.buen_sabor_backend.model.Empleado;

import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EmpleadoMapper extends MasterMapper<Empleado, EmpleadoDTO> {

    EmpleadoDTO toDTO(Empleado source);
    Empleado toEntity(EmpleadoDTO source);
}


