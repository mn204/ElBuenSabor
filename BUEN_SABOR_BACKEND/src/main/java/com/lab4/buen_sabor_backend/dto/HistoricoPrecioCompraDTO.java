package com.lab4.buen_sabor_backend.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class HistoricoPrecioCompraDTO extends MasterDTO{
    private LocalDate fecha;
    private Double precio;
}
