package com.lab4.buen_sabor_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CategoriaDTO extends MasterDTO {

    private String denominacion;
    private Long categoriaPadreId;
    private List<CategoriaDTO> subcategorias;
}
