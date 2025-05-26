package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.repository.ClienteRepository;
import com.lab4.buen_sabor_backend.repository.MasterRepository;
import com.lab4.buen_sabor_backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteServiceImpl extends MasterServiceImpl<Cliente, Long> implements ClienteService {

    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        super(clienteRepository);
    }


}
