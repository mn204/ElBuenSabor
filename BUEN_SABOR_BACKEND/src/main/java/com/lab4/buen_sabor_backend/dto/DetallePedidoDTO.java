package com.lab4.buen_sabor_backend.dto;

import lombok.Data;

@Data
public class DetallePedidoDTO extends MasterDTO{

    private String articuloNombre;
    private Integer cantidad;
    private Double subTotal;
}
