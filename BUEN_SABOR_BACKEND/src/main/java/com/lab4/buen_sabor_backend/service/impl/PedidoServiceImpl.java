package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.repository.PedidoRepository;
import com.lab4.buen_sabor_backend.service.PedidoService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoServiceImpl.class);
    private final PedidoRepository pedidoRepository;


    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, PedidoRepository pedidoRepository1) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository1;
    }

    @Override
    @Transactional
    public Pedido save(Pedido entity) {
        // Validaciones antes de guardar
        for(DetallePedido detalle : entity.getDetalles()) {
            detalle.setPedido(entity);
        }
        logger.info("Guardando ArticuloManufacturado: {}", entity.getId());
        return super.save(entity);
    }

}