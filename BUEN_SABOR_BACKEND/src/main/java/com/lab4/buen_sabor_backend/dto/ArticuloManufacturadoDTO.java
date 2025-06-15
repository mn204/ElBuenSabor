package com.lab4.buen_sabor_backend.dto;

import lombok.*;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloManufacturadoDTO extends ArticuloDTO {
    private String descripcion;
    private Integer tiempoEstimadoMinutos;
    private String preparacion;
    private List<DetalleArticuloManufacturadoDTO> detalles = new ArrayList<>();
}
