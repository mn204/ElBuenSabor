package com.lab4.buen_sabor_backend.mapper;

import com.lab4.buen_sabor_backend.dto.DetallePedidoDTO;
import com.lab4.buen_sabor_backend.model.DetallePedido;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DetallePedidoMapper extends MasterMapper<DetallePedido, DetallePedidoDTO> {

    DetallePedidoDTO toDTO(DetallePedido source);
    @Mappings({
            @Mapping(target = "articulo", ignore = true)  // Articulo es abstracto, lo seteás en el servicio
    })
    DetallePedido toEntity(DetallePedidoDTO source);
}

