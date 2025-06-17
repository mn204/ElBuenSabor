package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.dto.Estadisticas.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EstadisticaService {
    List<EstadisticaSucursalDTO> obtenerResumenPorSucursal(LocalDateTime desde, LocalDateTime hasta);

    List<ProductoMasVendidoDTO> obtenerProductosMasVendidos(Long sucursalId, LocalDateTime desde, LocalDateTime hasta, int top);

    List<ClienteFrecuenteDTO> obtenerClientesFrecuentesFiltrados(Long sucursalId, LocalDateTime desde, LocalDateTime hasta, String tipoPedido, int top);

    List<TicketPromedioDTO> obtenerTicketPromedio(Long sucursalId, LocalDateTime desde, LocalDateTime hasta);

    List<PedidosPorDiaDTO> obtenerPedidosPorDia(Long sucursalId, LocalDateTime desde, LocalDateTime hasta);

    List<VentasPorDiaDTO> obtenerVentasPorDia(Long sucursalId, LocalDateTime desde, LocalDateTime hasta);

    List<PedidosPorTipoDTO> obtenerPedidosPorTipo(Long sucursalId, LocalDateTime desde, LocalDateTime hasta);

}
