package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.DetallePedidoDTO;
import com.lab4.buen_sabor_backend.mapper.DetallePedidoMapper;
import com.lab4.buen_sabor_backend.model.DetallePedido;
import com.lab4.buen_sabor_backend.service.DetallePedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/detalle-pedido")
@CrossOrigin(origins = "*")
public class DetallePedidoController extends MasterControllerImpl<DetallePedido, DetallePedidoDTO, Long> implements MasterController<DetallePedidoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(DetallePedidoController.class);

    private final DetallePedidoService detallePedidoService;
    private final DetallePedidoMapper detallePedidoMapper;

    @Autowired
    public DetallePedidoController(DetallePedidoService detallePedidoService, DetallePedidoMapper detallePedidoMapper) {
        super(detallePedidoService);
        this.detallePedidoService = detallePedidoService;
        this.detallePedidoMapper = detallePedidoMapper;
    }

    @Override
    protected DetallePedido toEntity(DetallePedidoDTO dto) {
        return detallePedidoMapper.toEntity(dto);
    }

    @Override
    protected DetallePedidoDTO toDTO(DetallePedido entity) {
        return detallePedidoMapper.toDTO(entity);
    }
}
