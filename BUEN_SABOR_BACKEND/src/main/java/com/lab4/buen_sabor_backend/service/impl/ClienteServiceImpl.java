package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.repository.ClienteRepository;
import com.lab4.buen_sabor_backend.repository.MasterRepository;
import com.lab4.buen_sabor_backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteServiceImpl extends MasterServiceImpl<Cliente, Long> implements ClienteService {
    private final ClienteRepository clienteRepository;
    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        super(clienteRepository);
        this.clienteRepository = clienteRepository;
    }

    @Override
    public Optional<Cliente> findByUsuarioId(Long usuarioId) {
        return clienteRepository.findByUsuarioId(usuarioId);
    }
}
