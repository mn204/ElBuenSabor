package com.lab4.buen_sabor_backend.dto.Estadisticas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteFrecuenteDTO {
    private Long clienteId;
    private String nombreCliente;
    private Long cantidadPedidos;
}
