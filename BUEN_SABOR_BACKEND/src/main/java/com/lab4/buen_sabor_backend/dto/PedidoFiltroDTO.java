package com.lab4.buen_sabor_backend.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PedidoFiltroDTO extends MasterDTO{

    private Long clienteId;
    private String estado;
    private LocalDateTime desde;
    private LocalDateTime hasta;
    private int pagina;
    private int tamanio;
}
