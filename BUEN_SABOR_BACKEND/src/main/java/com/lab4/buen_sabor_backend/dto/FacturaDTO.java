package com.lab4.buen_sabor_backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FacturaDTO extends MasterDTO {

    private LocalDate fechaFacturacion;
    private Double totalVenta;
    private Long pedidoId;
    private String clienteNombre;
    private Boolean esNotaCredito;
}
