package com.lab4.buen_sabor_backend.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloInsumoDTO extends ArticuloDTO {
    private Double precioCompra;
    private Boolean esParaElaborar;
}
