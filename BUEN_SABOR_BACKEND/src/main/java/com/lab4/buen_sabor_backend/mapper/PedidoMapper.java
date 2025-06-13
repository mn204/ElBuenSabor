package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.ArticuloInsumoDTO;
import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.dto.PedidoResumenDTO;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.model.Pedido;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PedidoMapper extends MasterMapper<Pedido, PedidoDTO> {

    PedidoDTO toDTO(Pedido source);

    Pedido toEntity(PedidoDTO source);

    @Override
    List<PedidoDTO> toDTOsList(List<Pedido> source);

    @Override
    List<Pedido> toEntitiesList(List<PedidoDTO> source);
}

