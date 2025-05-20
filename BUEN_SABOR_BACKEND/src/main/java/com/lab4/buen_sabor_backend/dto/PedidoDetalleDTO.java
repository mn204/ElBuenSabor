package com.lab4.buen_sabor_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class PedidoDetalleDTO extends MasterDTO{

    private LocalDateTime fechaPedido;
    private String estado;
    private String tipoEnvio;
    private String formaPago;
    private Double total;
    private Double totalCosto;
    private LocalTime horaEstimadaFinalizacion;
    private String cliente;
    private List<DetallePedidoDTO> detalles;
}
