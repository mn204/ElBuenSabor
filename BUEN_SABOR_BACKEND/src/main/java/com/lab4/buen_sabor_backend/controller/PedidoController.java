package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.mapper.PedidoMapper;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.service.PedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController extends MasterControllerImpl<Pedido, PedidoDTO, Long> implements MasterController<PedidoDTO, Long>{

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    private final PedidoService pedidoService;
    private final PedidoMapper pedidoMapper;

    @Autowired
    public PedidoController(PedidoService pedidoService, PedidoMapper pedidoMapper) {
        super(pedidoService);
        this.pedidoService = pedidoService;
        this.pedidoMapper = pedidoMapper;
    }

    @Override
    protected Pedido toEntity(PedidoDTO dto) {
        return pedidoMapper.toEntity(dto);
    }

    @Override
    protected PedidoDTO toDTO(Pedido entity) {
        return pedidoMapper.toDTO(entity);
    }
}
