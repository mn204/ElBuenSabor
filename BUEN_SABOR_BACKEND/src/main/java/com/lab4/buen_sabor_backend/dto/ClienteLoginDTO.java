package com.lab4.buen_sabor_backend.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteLoginDTO {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
