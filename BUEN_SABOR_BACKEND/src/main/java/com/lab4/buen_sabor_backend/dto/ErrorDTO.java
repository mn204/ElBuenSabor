package com.lab4.buen_sabor_backend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDTO {
    private String errorMsg;
    private String errorClass;
    private String details;       // Opcional
    private String path;          // Ruta del request
    private Integer status;       // Código HTTP
}

