package com.lab4.buen_sabor_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalidadDTO extends MasterDTO{

    private String nombre;
    private ProvinciaDTO provincia;

}
