package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.mapper.ClienteMapper;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.service.ClienteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cliente")
@CrossOrigin(origins = "*")
public class ClienteController extends MasterControllerImpl<Cliente, ClienteDTO, Long> implements MasterController<ClienteDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);

    private final ClienteService clienteService;
    private final ClienteMapper clienteMapper;

    @Autowired
    public ClienteController(ClienteService clienteService, ClienteMapper clienteMapper) {
        super(clienteService);
        this.clienteService = clienteService;
        this.clienteMapper = clienteMapper;
    }

    @Override
    protected Cliente toEntity(ClienteDTO dto) {
        return clienteMapper.toEntity(dto);
    }

    @Override
    protected ClienteDTO toDTO(Cliente entity) {
        return clienteMapper.toDTO(entity);
    }
}
