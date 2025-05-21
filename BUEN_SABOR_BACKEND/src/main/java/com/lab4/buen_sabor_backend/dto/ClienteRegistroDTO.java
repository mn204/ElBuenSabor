package com.lab4.buen_sabor_backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRegistroDTO {
    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 10, max = 15)
    private String telefono;

    @Valid
    private DomicilioDTO domicilio;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}$",
            message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.")
    private String password;

    @NotBlank
    private String confirmarPassword;
}

