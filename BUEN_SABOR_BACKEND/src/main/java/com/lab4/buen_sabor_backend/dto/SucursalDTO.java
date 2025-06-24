package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SucursalDTO extends MasterDTO {
    private String nombre;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private Boolean casaMatriz;
    private EmpresaDTO empresa;
    private DomicilioDTO domicilio;
    private boolean eliminado;
}

