package com.lab4.buen_sabor_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaisDTO extends MasterDTO {

    private String nombre;
}
