package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ClienteDTO;
import com.lab4.buen_sabor_backend.mapper.ClienteMapper;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cliente")
@CrossOrigin(origins = "*")
@Tag(name = "Clientes", description = "Gestión de clientes y operaciones relacionadas")
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

    @Operation(summary = "Obtener cliente por ID de usuario")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ClienteDTO> getByUsuarioId(
            @Parameter(description = "ID del usuario asociado") @PathVariable Long usuarioId) {
        return clienteService.findByUsuarioId(usuarioId)
                .map(cliente -> ResponseEntity.ok(clienteMapper.toDTO(cliente)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Desasociar un domicilio de un cliente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Domicilio desasociado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cliente o domicilio no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno al desasociar domicilio")
    })
    @DeleteMapping("/{clienteId}/domicilio/{domicilioId}")
    public ResponseEntity<Void> removeDomicilioFromCliente(
            @Parameter(description = "ID del cliente") @PathVariable Long clienteId,
            @Parameter(description = "ID del domicilio a desasociar") @PathVariable Long domicilioId) {

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

    @Operation(summary = "Obtener clientes filtrados con opción de ordenamiento")
    @GetMapping("/filtrados")
    public ResponseEntity<Page<ClienteDTO>> obtenerClientesFiltrados(
            @Parameter(description = "Texto de búsqueda en nombre, apellido o email") @RequestParam(required = false) String busqueda,
            @Parameter(description = "Email específico para filtrar") @RequestParam(required = false) String email,
            @Parameter(description = "Orden ascendente o descendente por nombre (asc/desc)") @RequestParam(required = false) String ordenar,
            @Parameter(description = "Orden por pedidos (asc, desc, mas_pedidos, menos_pedidos)") @RequestParam(required = false) String ordenarPorPedidos,
            @Parameter(description = "Filtro por estado eliminado") @RequestParam(required = false) Boolean eliminado,
            @Parameter(description = "Parámetros de paginación") Pageable pageable
    ) {
        if (ordenarPorPedidos != null && !ordenarPorPedidos.isBlank()) {
            Page<Cliente> clientes = clienteService.buscarClientesFiltradosConOrdenPedidos(
                    busqueda, email, eliminado, ordenarPorPedidos, pageable
            );
            Page<ClienteDTO> result = clientes.map(clienteMapper::toDTO);
            return ResponseEntity.ok(result);
        }

        Sort sort = Sort.unsorted();
        if (ordenar != null) {
            if ("desc".equalsIgnoreCase(ordenar) || "z-a".equalsIgnoreCase(ordenar)) {
                sort = Sort.by(Sort.Direction.DESC, "nombre");
            } else if ("asc".equalsIgnoreCase(ordenar) || "a-z".equalsIgnoreCase(ordenar)) {
                sort = Sort.by(Sort.Direction.ASC, "nombre");
            }
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }

        Page<Cliente> clientes = clienteService.buscarClientesFiltrados(
                busqueda, email, eliminado, pageable
        );
        Page<ClienteDTO> result = clientes.map(clienteMapper::toDTO);

        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Eliminar cliente y usuario lógicamente")
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCliente(
            @Parameter(description = "ID del cliente a eliminar") @PathVariable Long id) {
        clienteService.eliminarCliente(id);
        logger.info("Cliente y usuario con id {} eliminados lógicamente.", id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Dar de alta cliente y usuario lógicamente")
    @PutMapping("/darAltaCliente/{id}")
    public ResponseEntity<Void> darDeAltaCliente(
            @Parameter(description = "ID del cliente a dar de alta") @PathVariable Long id) {
        clienteService.darDeAltaCliente(id);
        logger.info("Cliente y usuario con id {} dados de alta lógicamente.", id);
        return ResponseEntity.noContent().build();
    }
}
