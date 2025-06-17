package com.lab4.buen_sabor_backend.dto.Estadisticas;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoMasVendidoDTO {
    private String nombreProducto;
    private Long cantidadVendida;
}
