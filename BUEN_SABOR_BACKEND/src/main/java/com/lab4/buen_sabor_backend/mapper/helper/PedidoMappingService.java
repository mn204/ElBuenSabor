package com.lab4.buen_sabor_backend.mapper.helper;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.mapper.DetallePedidoMapper;
import com.lab4.buen_sabor_backend.mapper.PedidoMapper;
import com.lab4.buen_sabor_backend.model.DetallePedido;
import com.lab4.buen_sabor_backend.model.Pedido;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoMappingService {
    private final PedidoMapper pedidoMapper;
    private final DetallePedidoMapper detallePedidoMapper;
    private final ArticuloMapperHelper articuloMapperHelper;

    public PedidoMappingService(PedidoMapper pedidoMapper,
                                DetallePedidoMapper detallePedidoMapper,
                                ArticuloMapperHelper articuloMapperHelper) {
        this.pedidoMapper = pedidoMapper;
        this.detallePedidoMapper = detallePedidoMapper;
        this.articuloMapperHelper = articuloMapperHelper;
    }

    public Pedido mapPedidoDTOToEntity(PedidoDTO dto) {
        Pedido pedido = pedidoMapper.toEntity(dto);

        List<DetallePedido> detalles = dto.getDetalles().stream().map(detalleDTO -> {
            DetallePedido detalle = detallePedidoMapper.toEntity(detalleDTO);
            detalle.setArticulo(articuloMapperHelper.mapArticuloDTOToEntity(detalleDTO.getArticulo()));
            return detalle;
        }).toList();

        pedido.setDetalles(detalles);
        return pedido;
    }
}
