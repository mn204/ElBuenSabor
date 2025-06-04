package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.model.Pedido;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PedidoMapper extends MasterMapper<Pedido, PedidoDTO> {

    PedidoDTO toDTO(Pedido source);

    Pedido toEntity(PedidoDTO source);
}

