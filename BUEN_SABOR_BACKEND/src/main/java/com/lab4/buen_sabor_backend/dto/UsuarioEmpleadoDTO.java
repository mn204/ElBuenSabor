package com.lab4.buen_sabor_backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioEmpleadoDTO extends MasterDTO{
    private String username;
    private String password;
}