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
    private Set<DetalleArticuloManufacturadoDTO> detalles = new HashSet<>();
    private Set<ImagenArticuloManufacturadoDTO> imagenesArticuloManufacturado = new HashSet<>();
}
