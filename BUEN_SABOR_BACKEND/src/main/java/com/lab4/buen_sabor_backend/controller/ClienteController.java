package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.mapper.ClienteMapper;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.service.ClienteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ClienteDTO> getByUsuarioId(@PathVariable Long usuarioId) {
        return clienteService.findByUsuarioId(usuarioId)
                .map(cliente -> ResponseEntity.ok(clienteMapper.toDTO(cliente)))
                .orElse(ResponseEntity.notFound().build());
    }


    // Nuevo endpoint para desasociar domicilio
    @DeleteMapping("/{clienteId}/domicilio/{domicilioId}")
    public ResponseEntity<Void> removeDomicilioFromCliente(
            @PathVariable Long clienteId,
            @PathVariable Long domicilioId) {

        logger.info("Desasociando domicilio {} del cliente {}", domicilioId, clienteId);

        try {
            boolean removed = clienteService.removeDomicilioFromCliente(clienteId, domicilioId);

            if (removed) {
                logger.info("Domicilio {} desasociado exitosamente del cliente {}", domicilioId, clienteId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("No se pudo desasociar el domicilio {} del cliente {}", domicilioId, clienteId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al desasociar domicilio {} del cliente {}: {}", domicilioId, clienteId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/filtrados")
    public ResponseEntity<Page<ClienteDTO>> obtenerClientesFiltrados(
            @RequestParam(required = false) String busqueda, // Busca en nombre, apellido y email
            @RequestParam(required = false) String email,    // Parámetro adicional para email específico
            @RequestParam(required = false) String ordenar,  // "asc" o "desc"
            @RequestParam(required = false) Boolean eliminado,
            Pageable pageable
    ) {
        // Si se especifica ordenamiento, creamos un Sort personalizado
        Sort sort = Sort.unsorted();
        if (ordenar != null) {
            if ("desc".equalsIgnoreCase(ordenar) || "z-a".equalsIgnoreCase(ordenar)) {
                sort = Sort.by(Sort.Direction.DESC, "nombre");
            } else if ("asc".equalsIgnoreCase(ordenar) || "a-z".equalsIgnoreCase(ordenar)) {
                sort = Sort.by(Sort.Direction.ASC, "nombre");
            }
            // Crear nuevo Pageable con el ordenamiento
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }

        Page<Cliente> clientes = clienteService.buscarClientesFiltrados(
                busqueda, email, eliminado, pageable
        );
        Page<ClienteDTO> result = clientes.map(clienteMapper::toDTO);

        return ResponseEntity.ok(result);
    }


}
