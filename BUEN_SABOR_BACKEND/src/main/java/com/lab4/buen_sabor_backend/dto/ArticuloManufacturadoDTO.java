package com.lab4.buen_sabor_backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
public class ArticuloManufacturadoDTO extends MasterDTO {

    private String denominacion;
    private String descripcion;
    private Integer tiempoEstimadoMinutos;
    private String preparacion;
    private Double precioVenta;
    private String categoria;
    private List<DetalleArticuloManufacturadoDTO> detalles;
    private List<String> imagenes;
}
