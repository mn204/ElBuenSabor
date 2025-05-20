package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.time.LocalDate;

// TODO seguramente tengamos que cambiarlo.

@Data
public class PromocionDTO extends MasterDTO {

    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
