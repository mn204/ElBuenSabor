package com.lab4.buen_sabor_backend.dto;

import lombok.Data;

@Data
public class ArticuloInsumoDTO extends MasterDTO {

    private String denominacion;
    private Double precioCompra;
    private Double precioVenta;
    private Boolean esParaElaborar;
    private String categoria;
    private Integer stockDisponible;
}
