package com.lab4.buen_sabor_backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteActualizacionDTO {
    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @Email
    @NotBlank
    private String email;

    @Size(min = 10, max = 15)
    private String telefono;

    private Integer dni;
    private LocalDate fechaNacimiento;
}