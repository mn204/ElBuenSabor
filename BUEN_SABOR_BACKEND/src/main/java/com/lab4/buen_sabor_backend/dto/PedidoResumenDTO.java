package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Estado;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PedidoResumenDTO{

    private LocalDateTime fechaPedido;
    private Estado estado;
    private ClienteDTO cliente;
    private SucursalDTO sucursal;
    private Double total;
}
