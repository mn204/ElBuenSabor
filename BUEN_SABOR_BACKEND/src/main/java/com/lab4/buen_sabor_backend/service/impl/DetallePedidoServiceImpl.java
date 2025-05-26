package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.DetallePedido;
import com.lab4.buen_sabor_backend.repository.DetallePedidoRepository;
import com.lab4.buen_sabor_backend.service.DetallePedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetallePedidoServiceImpl extends MasterServiceImpl<DetallePedido, Long> implements DetallePedidoService {

    @Autowired
    public DetallePedidoServiceImpl(DetallePedidoRepository detallePedidoRepository) {
        super(detallePedidoRepository);
    }

}