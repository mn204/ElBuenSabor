package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO extends MasterDTO {
    private String denominacion;
    private CategoriaDTO categoriaPadre;
    private boolean eliminado;
    private String urlImagen;
}
