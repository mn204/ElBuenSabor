package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.FacturaDTO;
import com.lab4.buen_sabor_backend.model.Factura;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FacturaMapper extends MasterMapper<Factura, FacturaDTO> {
    FacturaDTO toDTO(Factura source);
    Factura toEntity(FacturaDTO source);
}

