package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.model.Domicilio;
import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.repository.ClienteRepository;
import com.lab4.buen_sabor_backend.repository.DomicilioRepository;
import com.lab4.buen_sabor_backend.repository.MasterRepository;
import com.lab4.buen_sabor_backend.service.ClienteService;
import com.lab4.buen_sabor_backend.service.UsuarioService;
import com.lab4.buen_sabor_backend.service.impl.specification.ClienteSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ClienteServiceImpl extends MasterServiceImpl<Cliente, Long> implements ClienteService {
    private final ClienteRepository clienteRepository;
    private final DomicilioRepository domicilioRepository;
    private final UsuarioService usuarioService;

    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository, DomicilioRepository domicilioRepository, UsuarioService usuarioService) {
        super(clienteRepository);
        this.clienteRepository = clienteRepository;
        this.domicilioRepository = domicilioRepository;
        this.usuarioService = usuarioService;
    }

    @Override
    public Optional<Cliente> findByUsuarioId(Long usuarioId) {
        return clienteRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public boolean removeDomicilioFromCliente(Long clienteId, Long domicilioId) {
        try {
            Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
            Optional<Domicilio> domicilioOpt = domicilioRepository.findById(domicilioId);

            if (clienteOpt.isPresent() && domicilioOpt.isPresent()) {
                Cliente cliente = clienteOpt.get();
                Domicilio domicilio = domicilioOpt.get();

                // Remover el domicilio del set de domicilios del cliente
                boolean removed = cliente.getDomicilios().remove(domicilio);

                if (removed) {
                    clienteRepository.save(cliente);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error al desasociar domicilio del cliente", e);
        }
    }

    @Override
    public Page<Cliente> buscarClientesFiltrados(
            String busqueda, // Busca en nombre, apellido y email
            String email,    // Parámetro adicional para email específico (opcional)
            Boolean eliminado,
            Pageable pageable
    ) {
        Specification<Cliente> spec = Specification
                .where(ClienteSpecification.nombreContains(busqueda)) // Busca en nombre, apellido y email
                .and(ClienteSpecification.emailContains(email)) // Filtro específico por email si se proporciona
                .and(ClienteSpecification.eliminadoEquals(eliminado));

        return clienteRepository.findAll(spec, pageable);
    }

    // Nuevo método para búsqueda con ordenamiento por cantidad de pedidos
    @Override
    public Page<Cliente> buscarClientesFiltradosConOrdenPedidos(
            String busqueda,
            String email,
            Boolean eliminado,
            String ordenarPorPedidos,
            Pageable pageable
    ) {
        // Determinar qué método usar según el ordenamiento
        if ("desc".equalsIgnoreCase(ordenarPorPedidos) || "mas_pedidos".equalsIgnoreCase(ordenarPorPedidos)) {
            return clienteRepository.findClientesOrderByPedidosDesc(busqueda, email, eliminado, pageable);
        } else if ("asc".equalsIgnoreCase(ordenarPorPedidos) || "menos_pedidos".equalsIgnoreCase(ordenarPorPedidos)) {
            return clienteRepository.findClientesOrderByPedidosAsc(busqueda, email, eliminado, pageable);
        } else {
            // Si no se especifica un ordenamiento válido, usar el método tradicional
            return buscarClientesFiltrados(busqueda, email, eliminado, pageable);
        }
    }

    @Override
    @Transactional
    public void eliminarCliente(Long clienteId) {
        // Buscar el empleado
        Cliente cliente = this.getById(clienteId);

        // Eliminar lógicamente el empleado
        this.delete(clienteId);

        // Eliminar lógicamente el usuario asociado
        if (cliente.getUsuario() != null) {
            usuarioService.delete(cliente.getUsuario().getId());
        }
    }

    @Override
    @Transactional
    public void darDeAltaCliente(Long clienteId) {
        // Buscar el empleado
        Cliente cliente= this.getById(clienteId);

        // Dar de alta lógicamente el empleado
        this.changeEliminado(clienteId);

        // Dar de alta lógicamente el usuario asociado
        if (cliente.getUsuario() != null) {
            usuarioService.changeEliminado(cliente.getUsuario().getId());
        }
    }


}
