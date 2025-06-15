package com.lab4.buen_sabor_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedidoDTO extends MasterDTO {
    private Integer cantidad;
    private Double subTotal;
    private ArticuloDTO articulo;
    private boolean eliminado;
    private PromocionDTO promocion;
}
