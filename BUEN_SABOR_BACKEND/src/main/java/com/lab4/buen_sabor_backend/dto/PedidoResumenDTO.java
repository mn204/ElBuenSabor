package com.lab4.buen_sabor_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PedidoResumenDTO {

    private LocalDateTime fechaPedido;
    private String estado;
    private String cliente;
    private String sucursal;
    private Double total;
}
