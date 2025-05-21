package com.lab4.buen_sabor_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleArticuloManufacturadoDTO extends MasterDTO {
    private Double cantidad;
    private ArticuloInsumoDTO articuloInsumo;
}
