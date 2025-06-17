package com.lab4.buen_sabor_backend.dto.Estadisticas;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticaSucursalDTO {
    private Long sucursalId;
    private String nombreSucursal;
    private Long cantidadPedidos;
    private Double totalVentas;
    private Double gananciaNeta;
    private Long pedidosCancelados;
    private Double tiempoPromedioEntrega;
}
