package com.lab4.buen_sabor_backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioClienteDTO extends MasterDTO{
    private String email;
    private String firebaseUid;
}
