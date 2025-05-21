package com.lab4.buen_sabor_backend.dto;

import java.time.LocalDateTime;

import com.lab4.buen_sabor_backend.model.enums.Estado;
import lombok.Data;

@Data
public class PedidoFiltroDTO{

    private ClienteDTO cliente;
    private Estado estado;
    private LocalDateTime desde;
    private LocalDateTime hasta;
    private int pagina;
    private int tamanio;
}
