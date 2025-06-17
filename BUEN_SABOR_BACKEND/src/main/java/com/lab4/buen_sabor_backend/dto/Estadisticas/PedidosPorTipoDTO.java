package com.lab4.buen_sabor_backend.dto.Estadisticas;

import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidosPorTipoDTO {
    private String tipoPedido;
    private Long cantidad;

    public PedidosPorTipoDTO(TipoEnvio tipoEnvio, Long cantidad) {
        this(tipoEnvio.name(), cantidad);
    }
}
