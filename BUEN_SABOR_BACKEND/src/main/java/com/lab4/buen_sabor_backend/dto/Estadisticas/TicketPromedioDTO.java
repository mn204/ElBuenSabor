package com.lab4.buen_sabor_backend.dto.Estadisticas;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketPromedioDTO {
    private Long sucursalId;
    private String nombreSucursal;
    private Double totalVentas; // totalVentas / cantidadPedidos
}
