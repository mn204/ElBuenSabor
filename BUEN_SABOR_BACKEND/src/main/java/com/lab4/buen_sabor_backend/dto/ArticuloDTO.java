package com.lab4.buen_sabor_backend.dto;


import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.model.UnidadMedida;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloDTO extends MasterDTO {
    private String denominacion;
    private Double precioVenta;
    private Set<ImagenArticuloDTO> imagenes = new HashSet<>();
    private UnidadMedidaDTO unidadMedida;
    private CategoriaDTO categoria;
    private boolean eliminado;
}

