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

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        super(pedidoRepository);
    }

}