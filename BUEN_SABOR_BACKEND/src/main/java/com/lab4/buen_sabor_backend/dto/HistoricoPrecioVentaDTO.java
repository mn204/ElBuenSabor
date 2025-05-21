package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
public class HistoricoPrecioVentaDTO extends MasterDTO{
    private Double precio;
    private LocalDate fecha;
}
