package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.mapper.PedidoMapper;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.MercadoPago.PreferenceMP;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
import com.lab4.buen_sabor_backend.service.MercadoPago.MercadoPagoService;
import com.lab4.buen_sabor_backend.service.PedidoService;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
@Tag(name = "Pedidos", description = "Gestión de pedidos y operaciones relacionadas")
public class PedidoController extends MasterControllerImpl<Pedido, PedidoDTO, Long> implements MasterController<PedidoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);

    private final PedidoService pedidoService;
    private final PedidoMapper pedidoMapper;
    private final MercadoPagoService mercadoPagoService;
    private final SucursalInsumoService sucursalInsumoService;
    private final ArticuloInsumoService articuloInsumoService;
    private final ArticuloManufacturadoService articuloManufacturadoService;

    @Autowired
    public PedidoController(PedidoService pedidoService, PedidoMapper pedidoMapper, MercadoPagoService mercadoPagoService,
                            SucursalInsumoService sucursalInsumoService, ArticuloInsumoService articuloInsumoService,
                            ArticuloManufacturadoService articuloManufacturadoService) {
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

    @Operation(summary = "Obtener pedidos del cliente con filtros")
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<Page<PedidoDTO>> getPedidosDelCliente(
            @Parameter(description = "ID del cliente") @PathVariable Long clienteId,
            @Parameter(description = "Nombre de la sucursal para filtrar") @RequestParam(required = false) String sucursal,
            @Parameter(description = "Estado del pedido para filtrar") @RequestParam(required = false) Estado estado,
            @Parameter(description = "Fecha desde para filtrar (ISO date-time)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaDesde,
            @Parameter(description = "Fecha hasta para filtrar (ISO date-time)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaHasta,
            @Parameter(description = "Nombre del artículo para filtrar") @RequestParam(required = false) String articulo,
            @Parameter(description = "Parámetros de paginación") Pageable pageable
    ) {
        Page<Pedido> pedidos = pedidoService.findPedidosByClienteWithFilters(clienteId, sucursal, estado, fechaDesde, fechaHasta, articulo, pageable);
        Page<PedidoDTO> result = pedidos.map(pedidoMapper::toDTO);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Contar pedidos del cliente")
    @GetMapping("/cliente/{clienteId}/count")
    public ResponseEntity<Long> getCountPedidosDelCliente(
            @Parameter(description = "ID del cliente") @PathVariable("clienteId") Long clienteId) {
        Long count = pedidoService.countPedidosByClienteId(clienteId);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Obtener pedidos filtrados para una sucursal")
    @GetMapping("/filtrados")
    public ResponseEntity<Page<PedidoDTO>> obtenerPedidosFiltrados(
            @Parameter(description = "ID de la sucursal") @RequestParam(required = false) Long idSucursal,
            @Parameter(description = "Lista de estados para filtrar") @RequestParam(required = false) List<Estado> estados,
            @Parameter(description = "Nombre del cliente") @RequestParam(required = false) String clienteNombre,
            @Parameter(description = "ID del pedido") @RequestParam(required = false) Long idPedido,
            @Parameter(description = "ID del empleado") @RequestParam(required = false) Long idEmpleado,
            @Parameter(description = "Estado de pago") @RequestParam(required = false) Boolean pagado,
            @Parameter(description = "Fecha desde (ISO date-time)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaDesde,
            @Parameter(description = "Fecha hasta (ISO date-time)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaHasta,
            @Parameter(description = "Tipo de envío") @RequestParam(required = false) TipoEnvio tipoEnvio,
            @PageableDefault(sort = "fechaPedido", direction = Sort.Direction.DESC)
            @Parameter(description = "Parámetros de paginación") Pageable pageable
    ) {
        Page<Pedido> pedidos = pedidoService.buscarPedidosFiltrados(idSucursal, estados, clienteNombre, idPedido, idEmpleado, pagado, fechaDesde, fechaHasta, tipoEnvio, pageable);
        Page<PedidoDTO> result = pedidos.map(pedidoMapper::toDTO);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Detalle de un pedido de un cliente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido encontrado y devuelto"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado o no pertenece al cliente")
    })
    @GetMapping("/cliente/{clienteId}/pedido/{id}")
    public ResponseEntity<PedidoDTO> getDetallePedidoCliente(
            @Parameter(description = "ID del cliente") @PathVariable Long clienteId,
            @Parameter(description = "ID del pedido") @PathVariable Long id) {
        Pedido pedido = pedidoService.findByIdAndCliente(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado o no pertenece al cliente"));
        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }

    @Operation(summary = "Obtener el último pedido de un cliente")
    @GetMapping("/ultimo/cliente/{id}")
    public ResponseEntity<PedidoDTO> getLastPedidoCliente(
            @Parameter(description = "ID del cliente") @PathVariable Long id) {
        Pedido pedido = pedidoService.findFirstByClienteIdOrderByIdDesc(id);
        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }

    @Operation(summary = "Obtener factura en PDF del pedido del cliente")
    @GetMapping("/cliente/{clienteId}/pedido/{id}/factura")
    public ResponseEntity<byte[]> getFacturaPdf(
            @Parameter(description = "ID del cliente") @PathVariable Long clienteId,
            @Parameter(description = "ID del pedido") @PathVariable Long id) {
        byte[] pdf = pedidoService.generarFacturaPDF(id, clienteId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
                .attachment()
                .filename("factura_pedido_" + id + ".pdf")
                .build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @Operation(summary = "Marcar un pedido como pagado")
    @PutMapping("/{id}/pagar")
    public ResponseEntity<PedidoDTO> pagarPedido(
            @Parameter(description = "ID del pedido") @PathVariable Long id) {
        Pedido pedidoActualizado = pedidoService.marcarComoPagado(id);
        PedidoDTO pedidoDTO = pedidoMapper.toDTO(pedidoActualizado);
        return ResponseEntity.ok(pedidoDTO);
    }

    @Operation(summary = "Cambiar el estado de un pedido")
    @PutMapping("/estado")
    public ResponseEntity<Void> cambiarEstadoPedido(
            @Parameter(description = "Datos del pedido con nuevo estado") @RequestBody PedidoDTO pedidoDTO) {
        pedidoService.cambiarEstadoPedido(pedidoMapper.toEntity(pedidoDTO));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Verificar y procesar un pedido descontando stock")
    @PostMapping("/verificar-y-procesar")
    public ResponseEntity<?> verificarYProcesar(
            @Parameter(description = "Pedido a verificar y procesar") @RequestBody Pedido pedido) {
        try {
            pedidoService.verificarYDescontarStockPedido(pedido);
            return ResponseEntity.ok(true); // Devuelve true si todo salió bien
        } catch (Exception e) {
            logger.error("Error en controlador: " + e.getMessage(), e);
            return ResponseEntity.ok(false); // Devuelve false en caso de error
        }
    }

    @Operation(summary = "Verificar stock disponible para un pedido")
    @PostMapping("/verificar-stock")
    public ResponseEntity<Boolean> verificarStockPedido(
            @Parameter(description = "Pedido a verificar stock") @RequestBody Pedido pedido) {
        boolean resultado = pedidoService.verificarStockPedido(pedido);
        return ResponseEntity.ok(resultado);
    }

    @Operation(summary = "Verificar stock de un artículo en una sucursal")
    @GetMapping("/verificar-stock-articulo/{aritculoId}/{cantidad}/{sucursalId}")
    public ResponseEntity<?> verificarStockArticulo(
            @Parameter(description = "ID del artículo") @PathVariable Long aritculoId,
            @Parameter(description = "Cantidad requerida") @PathVariable int cantidad,
            @Parameter(description = "ID de la sucursal") @PathVariable Long sucursalId) {
        try {
            boolean resultado = pedidoService.verificarStockArticulo(aritculoId, cantidad, sucursalId);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.error("Error en controlador: ", e);
            return ResponseEntity.ok(false);
        }
    }

    @Operation(summary = "Crear preferencia de MercadoPago para un pedido")
    @PostMapping("/create_preference_mp")
    public PreferenceMP crearPreferenciaMercadoPago(
            @Parameter(description = "Pedido para crear preferencia") @RequestBody Pedido pedido) {
        return mercadoPagoService.getPreferenciaIdMercadoPago(pedido);
    }

    @Operation(summary = "Exportar pedidos a Excel")
    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportarPedidosExcel(
            @Parameter(description = "Lista de pedidos a exportar") @RequestBody List<PedidoDTO> pedidosDTO) {
        byte[] excel = pedidoService.exportarPedidosAExcel(pedidoMapper.toEntitiesList(pedidosDTO));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("pedidos.xlsx").build());

        return new ResponseEntity<>(excel, headers, HttpStatus.OK);
    }

    @Operation(summary = "Exportar pedidos filtrados a Excel")
    @GetMapping("/filtrados/excel")
    public ResponseEntity<byte[]> exportarPedidosFiltradosExcel(
            @Parameter(description = "ID de la sucursal") @RequestParam(required = false) Long idSucursal,
            @Parameter(description = "Lista de estados para filtrar") @RequestParam(required = false) List<Estado> estados,
            @Parameter(description = "Nombre del cliente") @RequestParam(required = false) String clienteNombre,
            @Parameter(description = "ID del pedido") @RequestParam(required = false) Long idPedido,
            @Parameter(description = "ID del empleado") @RequestParam(required = false) Long idEmpleado,
            @Parameter(description = "Fecha desde (ISO date-time)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaDesde,
            @Parameter(description = "Fecha hasta (ISO date-time)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaHasta,
            @Parameter(description = "Estado de pago") @RequestParam(required = false) Boolean pagado,
            @Parameter(description = "Tipo de envío") @RequestParam(required = false) TipoEnvio tipoEnvio
    ) {
        byte[] excel = pedidoService.exportarPedidosFiltradosExcel(
                idSucursal, estados, clienteNombre, idPedido, idEmpleado, fechaDesde, fechaHasta, pagado, tipoEnvio
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("pedidos_filtrados.xlsx").build());

        return new ResponseEntity<>(excel, headers, HttpStatus.OK);
    }
}
