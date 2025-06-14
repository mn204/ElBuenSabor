package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Pedido;

import java.util.List;

public interface ExcelService {
    byte[] exportarPedidosAExcel(List<Pedido> pedidos);
}
