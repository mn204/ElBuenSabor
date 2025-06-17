package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.dto.Estadisticas.*;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import com.lab4.buen_sabor_backend.repository.EstadisticaRepository;
import com.lab4.buen_sabor_backend.repository.PedidoRepository;
import com.lab4.buen_sabor_backend.service.EstadisticaService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadisiticaServiceImpl implements EstadisticaService{

    private final EstadisticaRepository estadisticaRepository;

    @Override
    public List<EstadisticaSucursalDTO> obtenerResumenPorSucursal(LocalDateTime desde, LocalDateTime hasta) {
        return estadisticaRepository.obtenerResumenPorSucursal(desde, hasta);
    }

    @Override
    public List<ProductoMasVendidoDTO> obtenerProductosMasVendidos(Long sucursalId, LocalDateTime desde, LocalDateTime hasta, int top) {
        return estadisticaRepository.obtenerProductosMasVendidos(sucursalId, desde, hasta, PageRequest.of(0, top));
    }

    @Override
    public List<ClienteFrecuenteDTO> obtenerClientesFrecuentesFiltrados(Long sucursalId, LocalDateTime desde, LocalDateTime hasta, String tipoPedido, int top) {
        TipoEnvio tipo = null;
        if (tipoPedido != null) {
            tipo = TipoEnvio.valueOf(tipoPedido); // Lanza IllegalArgumentException si el string es inválido
        }
        return estadisticaRepository.obtenerClientesFrecuentesFiltrados(sucursalId, desde, hasta, tipo, PageRequest.of(0, top));
    }

    @Override
    @Transactional
    public List<TicketPromedioDTO> obtenerTicketPromedio(Long sucursalId, LocalDateTime desde, LocalDateTime hasta) {
        return estadisticaRepository.calcularTicketPromedio(sucursalId, desde, hasta);
    }

    @Override
    @Transactional
    public List<PedidosPorDiaDTO> obtenerPedidosPorDia(Long sucursalId, LocalDateTime desde, LocalDateTime hasta) {
        return estadisticaRepository.obtenerPedidosPorDia(sucursalId, desde, hasta);
    }

    @Override
    @Transactional
    public List<VentasPorDiaDTO> obtenerVentasPorDia(Long sucursalId, LocalDateTime desde, LocalDateTime hasta) {
        return estadisticaRepository.obtenerVentasPorDia(sucursalId, desde, hasta);
    }

    @Override
    @Transactional
    public List<PedidosPorTipoDTO> obtenerPedidosPorTipo(Long sucursalId, LocalDateTime desde, LocalDateTime hasta) {
        return estadisticaRepository.cantidadPedidosPorTipo(sucursalId, desde, hasta);
    }

}
