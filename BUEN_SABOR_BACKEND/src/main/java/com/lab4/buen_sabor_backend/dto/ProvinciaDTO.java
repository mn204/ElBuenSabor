package com.lab4.buen_sabor_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProvinciaDTO extends MasterDTO{

    private String nombre;
    private PaisDTO pais;
}
