package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
public class ExistenciaDTO extends MasterDTO {

    private LocalDate fechaCompra;
    private LocalDate fechaVencimiento;
    private Integer cantidad;
    private SucursalInsumoDTO sucursalInsumo;
}
