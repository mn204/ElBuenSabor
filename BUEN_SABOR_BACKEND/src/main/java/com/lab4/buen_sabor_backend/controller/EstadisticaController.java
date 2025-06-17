package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.Estadisticas.*;
import com.lab4.buen_sabor_backend.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EstadisticaController {

    private final EstadisticaService estadisticaService;

    @GetMapping("/resumen-sucursales")
    public ResponseEntity<List<EstadisticaSucursalDTO>> getResumenSucursales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerResumenPorSucursal(desde, hasta));
    }

    @GetMapping("/productos-mas-vendidos-filtrado")
    public ResponseEntity<List<ProductoMasVendidoDTO>> getProductosMasVendidos(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(defaultValue = "5") int top) {
        return ResponseEntity.ok(estadisticaService.obtenerProductosMasVendidos(sucursalId, desde, hasta, top));
    }

    @GetMapping("/clientes-frecuentes-filtrado")
    public ResponseEntity<List<ClienteFrecuenteDTO>> getClientesFrecuentesFiltrados(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(required = false) String tipoPedido,
            @RequestParam(defaultValue = "5") int top) {
        return ResponseEntity.ok(estadisticaService.obtenerClientesFrecuentesFiltrados(sucursalId, desde, hasta, tipoPedido, top));
    }

    @GetMapping("/ticket-promedio")
    public ResponseEntity<List<TicketPromedioDTO>> getTicketPromedio(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerTicketPromedio(sucursalId, desde, hasta));
    }

    @GetMapping("/pedidos-por-dia")
    public ResponseEntity<List<PedidosPorDiaDTO>> getPedidosPorDia(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerPedidosPorDia(sucursalId, desde, hasta));
    }

    @GetMapping("/ventas-por-dia")
    public ResponseEntity<List<VentasPorDiaDTO>> getVentasPorDia(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(estadisticaService.obtenerVentasPorDia(sucursalId, desde, hasta));
    }

    @GetMapping("/pedidos-por-tipo")
    public ResponseEntity<List<PedidosPorTipoDTO>> getPedidosPorTipo(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        List<PedidosPorTipoDTO> resultado = estadisticaService.obtenerPedidosPorTipo(sucursalId, desde, hasta);
        return ResponseEntity.ok(resultado);
    }

}
