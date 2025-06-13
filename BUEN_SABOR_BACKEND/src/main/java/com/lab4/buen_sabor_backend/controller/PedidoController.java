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

    // GET con filtros para un cliente específico
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoDTO>> getPedidosDelCliente(
            @PathVariable Long clienteId,
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(required = false) String articulo
    ) {
        List<Pedido> pedidos = pedidoService.findPedidosByClienteWithFilters(clienteId, sucursal, estado, desde, hasta, articulo);
        List<PedidoDTO> result = pedidos.stream().map(pedidoMapper::toDTO).toList();
        return ResponseEntity.ok(result);
    }

    // GET de detalle de un pedido de un cliente
    @GetMapping("/cliente/{clienteId}/pedido/{id}")
    public ResponseEntity<PedidoDTO> getDetallePedidoCliente(@PathVariable Long clienteId, @PathVariable Long id) {
        Pedido pedido = pedidoService.findByIdAndCliente(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado o no pertenece al cliente"));
        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }

    // GET para obtener el PDF de un pedido del cliente

    /*
    @GetMapping("/cliente/{clienteId}/pedido/{id}/factura")
    public ResponseEntity<byte[]> getFacturaPdf(@PathVariable Long clienteId, @PathVariable Long id) {
        Pedido pedido = pedidoService.findByIdAndCliente(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado o no pertenece al cliente"));

        byte[] pdf = pdfService.generarFacturaPedido(pedido);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("factura_pedido_" + pedido.getId() + ".pdf").build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

     */
    @PostMapping("/verificar-y-procesar")
    public ResponseEntity<?> verificarYProcesar(@RequestBody Pedido pedido) {
        try {
            boolean resultado = pedidoService.verificarYDescontarStockPedido(pedido);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.error("Error en controlador: ", e);
            return ResponseEntity.ok(false); // Devuelve false en caso de error
        }
    }
}
