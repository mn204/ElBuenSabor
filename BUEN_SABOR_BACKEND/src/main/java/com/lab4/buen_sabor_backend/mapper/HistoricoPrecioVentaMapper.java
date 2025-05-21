package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.HistoricoPrecioVentaDTO;
import com.lab4.buen_sabor_backend.model.HistoricoPrecioVenta;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface HistoricoPrecioVentaMapper extends MasterMapper<HistoricoPrecioVenta, HistoricoPrecioVentaDTO> {

    HistoricoPrecioVentaDTO toDTO(HistoricoPrecioVenta source);
    HistoricoPrecioVenta toEntity(HistoricoPrecioVentaDTO source);
}

