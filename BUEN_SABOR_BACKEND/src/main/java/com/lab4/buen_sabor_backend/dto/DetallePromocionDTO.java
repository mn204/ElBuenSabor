package com.lab4.buen_sabor_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePromocionDTO extends MasterDTO {
    private Integer cantidad;
    private PromocionDTO promocion;
    private ArticuloDTO articulo;
}
