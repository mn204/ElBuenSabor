package com.lab4.buen_sabor_backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoLoginDTO {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
