package com.lab4.buen_sabor_backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DomicilioDTO extends MasterDTO {
    @NotBlank
    private String calle;

    @NotNull
    private Integer numero;

    @NotNull
    private Integer codigoPostal;

    @NotNull
    private LocalidadDTO localidad;

    private String piso;
    private String nroDepartamento;
    private String detalles;
}

