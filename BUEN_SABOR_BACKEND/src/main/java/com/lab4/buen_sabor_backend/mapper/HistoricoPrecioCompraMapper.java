package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.HistoricoPrecioCompraDTO;
import com.lab4.buen_sabor_backend.model.HistoricoPrecioCompra;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface HistoricoPrecioCompraMapper extends MasterMapper<HistoricoPrecioCompra, HistoricoPrecioCompraDTO> {

    HistoricoPrecioCompraDTO toDTO(HistoricoPrecioCompra source);
    HistoricoPrecioCompra toEntity(HistoricoPrecioCompraDTO source);
}

