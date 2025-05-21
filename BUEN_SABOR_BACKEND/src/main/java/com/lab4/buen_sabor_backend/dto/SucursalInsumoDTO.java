package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SucursalInsumoDTO extends MasterDTO {
    private Integer stockMinimo;
    private Integer stockMaximo;
    private SucursalDTO sucursal;
}
