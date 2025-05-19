package com.lab4.buen_sabor_backend.dto;

import lombok.Data;

@Data
public class DetalleArticuloManufacturadoDTO extends MasterDTO{

    private String insumoNombre;
    private Double cantidad;
    private String unidadMedida;
}
