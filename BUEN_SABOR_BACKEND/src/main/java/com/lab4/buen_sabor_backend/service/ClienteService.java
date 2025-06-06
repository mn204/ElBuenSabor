package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Cliente;


import java.util.Optional;

public interface ClienteService extends MasterService<Cliente, Long>{

    public Optional<Cliente> findByUsuarioId(Long usuarioId);

}
