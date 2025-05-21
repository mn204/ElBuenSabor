package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Rol;

import lombok.*;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoRegistroDTO {
    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @NotBlank
    @Size(min = 10, max = 15)
    private String telefono;

    @Email
    @NotBlank
    private String email;

    @Valid
    private DomicilioDTO domicilio;

    @NotNull
    private Rol rolEmpleado;
    private LocalDate fechaNacimiento;
    private Integer dni;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}$")
    private String password;

    @NotBlank
    private String confirmarPassword;
}
