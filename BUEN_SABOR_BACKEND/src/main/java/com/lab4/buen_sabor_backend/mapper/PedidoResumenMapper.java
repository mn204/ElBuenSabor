package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.PedidoResumenDTO;
import com.lab4.buen_sabor_backend.model.Pedido;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = { ClienteMapper.class, SucursalMapper.class })
public interface PedidoResumenMapper {
    PedidoResumenDTO toDTO(Pedido pedido);
    List<PedidoResumenDTO> toDTOList(List<Pedido> pedidos);
}
