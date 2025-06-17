package com.lab4.buen_sabor_backend.dto.Estadisticas;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidosPorDiaDTO {
    private java.sql.Date fecha;
    private Long cantidadPedidos;
}
