package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.mapper.PedidoMapper;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.service.PedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.format.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController extends MasterControllerImpl<Pedido, PedidoDTO, Long> implements MasterController<PedidoDTO, Long>{

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    private final PedidoService pedidoService;
    private final PedidoMapper pedidoMapper;

    @Autowired
    public PedidoController(PedidoService pedidoService, PedidoMapper pedidoMapper) {
        super(pedidoService);
        this.pedidoService = pedidoService;
        this.pedidoMapper = pedidoMapper;
    }

    @Override
    protected Pedido toEntity(PedidoDTO dto) {
        return pedidoMapper.toEntity(dto);
    }

    @Override
    protected PedidoDTO toDTO(Pedido entity) {
        return pedidoMapper.toDTO(entity);
    }

    @GetMapping("/cliente")
    public ResponseEntity<List<PedidoDTO>> getPedidosDelCliente(
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(required = false) String articulo
    ) {
        Long clienteId = getClienteIdAutenticado(); // implementalo según tu seguridad
        List<Pedido> pedidos = pedidoService.findPedidosByClienteWithFilters(clienteId, sucursal, estado, desde, hasta, articulo);
        List<PedidoDTO> result = pedidos.stream().map(pedidoMapper::toDTO).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/cliente/{id}")
    public ResponseEntity<PedidoDTO> getDetallePedidoCliente(@PathVariable Long id) {
        Long clienteId = getClienteIdAutenticado();
        Pedido pedido = pedidoService.findByIdAndCliente(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado o no pertenece al cliente"));
        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }
    /*
    @GetMapping("/cliente/{id}/factura")
    public ResponseEntity<byte[]> getFacturaPdf(@PathVariable Long id) {
        Long clienteId = getClienteIdAutenticado();
        Pedido pedido = pedidoService.findByIdAndCliente(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado o no pertenece al cliente"));

        byte[] pdf = pdfService.generarFacturaPedido(pedido); // métodos a implementar en PdfService
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("factura_pedido_" + pedido.getId() + ".pdf").build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

     */


    private Long getClienteIdAutenticado() {
        // Este métodos debe extraer el ID del cliente autenticado (ej: desde JWT o Spring Security)
        // Ejemplo:
        // return ((UsuarioPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getClienteId();
        throw new UnsupportedOperationException("Implementar según seguridad");
    }
}
