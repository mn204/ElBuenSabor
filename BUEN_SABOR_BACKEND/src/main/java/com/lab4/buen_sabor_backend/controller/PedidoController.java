package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.mapper.PedidoMapper;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.model.MercadoPago.PreferenceMP;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
import com.lab4.buen_sabor_backend.service.MercadoPago.MercadoPagoService;
import com.lab4.buen_sabor_backend.service.PedidoService;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController extends MasterControllerImpl<Pedido, PedidoDTO, Long> implements MasterController<PedidoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    private final PedidoService pedidoService;
    private final PedidoMapper pedidoMapper;
    private final MercadoPagoService mercadoPagoService;
    private final SucursalInsumoService sucursalInsumoService;
    private final ArticuloInsumoService articuloInsumoService;
    private final ArticuloManufacturadoService articuloManufacturadoService;
    @Autowired
    public PedidoController(PedidoService pedidoService, PedidoMapper pedidoMapper, MercadoPagoService mercadoPagoService, SucursalInsumoService sucursalInsumoService, ArticuloInsumoService articuloInsumoService, ArticuloManufacturadoService articuloManufacturadoService) {
        super(pedidoService);
        this.pedidoService = pedidoService;
        this.pedidoMapper = pedidoMapper;
        this.mercadoPagoService = mercadoPagoService;
        this.sucursalInsumoService = sucursalInsumoService;
        this.articuloInsumoService = articuloInsumoService;
        this.articuloManufacturadoService = articuloManufacturadoService;
    }

    @Override
    protected Pedido toEntity(PedidoDTO dto) {
        return pedidoMapper.toEntity(dto);
    }

    @Override
    protected PedidoDTO toDTO(Pedido entity) {
        return pedidoMapper.toDTO(entity);
    }

    protected List<Pedido> toEntity(List<PedidoDTO> dtoList) {
        return pedidoMapper.toEntitiesList(dtoList);
    }

    // GET de pedidos con filtros para un cliente específico
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<Page<PedidoDTO>> getPedidosDelCliente(
            @PathVariable Long clienteId,
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(required = false) String articulo,
            Pageable pageable
    ) {
        Page<Pedido> pedidos = pedidoService.findPedidosByClienteWithFilters(clienteId, sucursal, estado, desde, hasta, articulo, pageable);
        Page<PedidoDTO> result = pedidos.map(pedidoMapper::toDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/cliente/{clienteId}/count")
    public ResponseEntity<Long> getCountPedidosDelCliente(@PathVariable("clienteId") Long clienteId) {
        Long count = pedidoService.countPedidosByClienteId(clienteId);
        return ResponseEntity.ok(count);
    }


    //GET de pedidos con filtros para una sucursal específica
    @GetMapping("/filtrados")
    public ResponseEntity<Page<PedidoDTO>> obtenerPedidosFiltrados(
            @RequestParam(required = false) Long idSucursal,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) String clienteNombre,
            @RequestParam(required = false) Long idPedido,
            @RequestParam(required = false) Long idEmpleado,
            @RequestParam(required = false) Boolean pagado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta,
            Pageable pageable
    ) {
        Page<Pedido> pedidos = pedidoService.buscarPedidosFiltrados(idSucursal, estado, clienteNombre, idPedido, idEmpleado, pagado, fechaDesde, fechaHasta, pageable);
        Page<PedidoDTO> result = pedidos.map(pedidoMapper::toDTO);

        return ResponseEntity.ok(result);
    }

    // GET de detalle de un pedido de un cliente
    @GetMapping("/cliente/{clienteId}/pedido/{id}")
    public ResponseEntity<PedidoDTO> getDetallePedidoCliente(@PathVariable Long clienteId, @PathVariable Long id) {
        Pedido pedido = pedidoService.findByIdAndCliente(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado o no pertenece al cliente"));
        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }

    @GetMapping("/ultimo/cliente/{id}")
    public ResponseEntity<PedidoDTO> getLastPedidoCliente(@PathVariable Long id) {
        Pedido pedido = pedidoService.findFirstByClienteIdOrderByIdDesc(id);
        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }

    // GET para obtener el PDF de un pedido del cliente
    @GetMapping("/cliente/{clienteId}/pedido/{id}/factura")
    public ResponseEntity<byte[]> getFacturaPdf(@PathVariable Long clienteId, @PathVariable Long id) {
        byte[] pdf = pedidoService.generarFacturaPDF(id, clienteId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
                .attachment()
                .filename("factura_pedido_" + id + ".pdf")
                .build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    //cambiar pagado del pedido
    @PutMapping("/{id}/pagar")
    public ResponseEntity<PedidoDTO> pagarPedido(@PathVariable Long id) {
        Pedido pedidoActualizado = pedidoService.marcarComoPagado(id);
        PedidoDTO pedidoDTO = pedidoMapper.toDTO(pedidoActualizado);
        return ResponseEntity.ok(pedidoDTO);
    }

    //Cambiar estado del pedido
    @PutMapping("/estado")
    public ResponseEntity<Void> cambiarEstadoPedido(@RequestBody PedidoDTO pedidoDTO) {
        pedidoService.cambiarEstadoPedido(pedidoMapper.toEntity(pedidoDTO));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verificar-y-procesar")
    public ResponseEntity<?> verificarYProcesar(@RequestBody Pedido pedido) {
        try {
            pedidoService.verificarYDescontarStockPedido(pedido);
            return ResponseEntity.ok(true); // Devuelve true si todo salió bien
        } catch (Exception e) {
            logger.error("Error en controlador: " + e.getMessage(), e);
            return ResponseEntity.ok(false); // Devuelve false en caso de error
        }
    }


    @PostMapping("/verificar-stock")
    public ResponseEntity<Boolean> verificarStockPedido(@RequestBody Pedido pedido) {
        boolean resultado = pedidoService.verificarStockPedido(pedido); // Si falla, lanza RuntimeException
        return ResponseEntity.ok(resultado);
    }


    @GetMapping("/verificar-stock-articulo/{aritculoId}/{cantidad}/{sucursalId}")
    public ResponseEntity<?> verificarStockArticulo(@PathVariable Long aritculoId, @PathVariable int cantidad, @PathVariable Long sucursalId) {
        try {
            boolean resultado = pedidoService.verificarStockArticulo(aritculoId, cantidad, sucursalId);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.error("Error en controlador: ", e);
            return ResponseEntity.ok(false); // Devuelve false en caso de error
        }
    }

    @PostMapping("/create_preference_mp")
    public PreferenceMP crearPreferenciaMercadoPago(@RequestBody Pedido pedido) {
        return mercadoPagoService.getPreferenciaIdMercadoPago(pedido);
    }

    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportarPedidosExcel(@RequestBody List<PedidoDTO> pedidosDTO) {
        byte[] excel = pedidoService.exportarPedidosAExcel(pedidoMapper.toEntitiesList(pedidosDTO));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("pedidos.xlsx").build());

        return new ResponseEntity<>(excel, headers, HttpStatus.OK);
    }

    @GetMapping("/filtrados/excel")
    public ResponseEntity<byte[]> exportarPedidosFiltradosExcel(
            @RequestParam(required = false) Long idSucursal,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) String clienteNombre,
            @RequestParam(required = false) Long idPedido,
            @RequestParam(required = false) Long idEmpleado,
            @RequestParam(required = false) Boolean pagado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta
    ) {
        byte[] excel = pedidoService.exportarPedidosFiltradosExcel(
                idSucursal, estado, clienteNombre, idPedido, idEmpleado, fechaDesde, fechaHasta, pagado
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("pedidos_filtrados.xlsx").build());

        return new ResponseEntity<>(excel, headers, HttpStatus.OK);
    }

}
