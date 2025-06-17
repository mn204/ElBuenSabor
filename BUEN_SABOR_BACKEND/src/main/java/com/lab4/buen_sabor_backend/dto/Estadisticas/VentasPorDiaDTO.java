package com.lab4.buen_sabor_backend.dto.Estadisticas;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentasPorDiaDTO {
    private java.sql.Date fecha;
    private Double totalVentas;
}
