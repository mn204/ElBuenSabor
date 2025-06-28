package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.Estadisticas.*;
import com.lab4.buen_sabor_backend.service.EstadisticaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
@Tag(name = "Estadísticas", description = "Estadísticas y análisis de ventas y pedidos")
@RequiredArgsConstructor
public class EstadisticaController {

    private final EstadisticaService estadisticaService;

    @Operation(summary = "Obtener resumen por sucursal", description = "Resumen estadístico de ventas por sucursal en un rango de fechas")
    @ApiResponse(responseCode = "200", description = "Resumen generado correctamente")
    @GetMapping("/resumen-sucursales")
    public ResponseEntity<List<EstadisticaSucursalDTO>> getResumenSucursales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerResumenPorSucursal(desde, hasta));
    }

    @Operation(summary = "Productos más vendidos", description = "Devuelve el top N de productos más vendidos, con filtros opcionales")
    @ApiResponse(responseCode = "200", description = "Lista generada correctamente")
    @GetMapping("/productos-mas-vendidos-filtrado")
    public ResponseEntity<List<ProductoMasVendidoDTO>> getProductosMasVendidos(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(defaultValue = "5") int top) {
        return ResponseEntity.ok(estadisticaService.obtenerProductosMasVendidos(sucursalId, desde, hasta, top));
    }

    @Operation(summary = "Clientes más frecuentes", description = "Top clientes más frecuentes por sucursal, tipo de pedido y fechas")
    @GetMapping("/clientes-frecuentes-filtrado")
    public ResponseEntity<List<ClienteFrecuenteDTO>> getClientesFrecuentesFiltrados(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(required = false) String tipoPedido,
            @RequestParam(defaultValue = "5") int top) {
        return ResponseEntity.ok(estadisticaService.obtenerClientesFrecuentesFiltrados(sucursalId, desde, hasta, tipoPedido, top));
    }

    @Operation(summary = "Ticket promedio", description = "Obtiene el promedio de tickets vendidos por sucursal")
    @GetMapping("/ticket-promedio")
    public ResponseEntity<List<TicketPromedioDTO>> getTicketPromedio(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerTicketPromedio(sucursalId, desde, hasta));
    }

    @Operation(summary = "Pedidos por día", description = "Cantidad de pedidos diarios en un rango de fechas")
    @GetMapping("/pedidos-por-dia")
    public ResponseEntity<List<PedidosPorDiaDTO>> getPedidosPorDia(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerPedidosPorDia(sucursalId, desde, hasta));
    }

    @Operation(summary = "Ventas por día", description = "Total de ventas diarias en un rango de fechas")
    @GetMapping("/ventas-por-dia")
    public ResponseEntity<List<VentasPorDiaDTO>> getVentasPorDia(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerVentasPorDia(sucursalId, desde, hasta));
    }

    @Operation(summary = "Pedidos por tipo", description = "Distribución de pedidos según el tipo (Delivery, Takeaway, etc)")
    @GetMapping("/pedidos-por-tipo")
    public ResponseEntity<List<PedidosPorTipoDTO>> getPedidosPorTipo(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        List<PedidosPorTipoDTO> resultado = estadisticaService.obtenerPedidosPorTipo(sucursalId, desde, hasta);
        return ResponseEntity.ok(resultado);
    }

}
