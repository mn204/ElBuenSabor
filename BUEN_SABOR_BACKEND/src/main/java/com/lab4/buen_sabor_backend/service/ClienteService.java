package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.model.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.Optional;

public interface ClienteService extends MasterService<Cliente, Long>{

    public Optional<Cliente> findByUsuarioId(Long usuarioId);
    boolean removeDomicilioFromCliente(Long clienteId, Long domicilioId);

    Page<Cliente> buscarClientesFiltrados(
            String busqueda,
            String email,
            Boolean eliminado,
            Pageable pageable
    );

}
