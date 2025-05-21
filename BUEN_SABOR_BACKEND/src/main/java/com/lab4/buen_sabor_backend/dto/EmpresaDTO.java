package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO extends MasterDTO {
    private String nombre;
    private String razonSocial;
    private Long cuil;
}
