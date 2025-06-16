package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.Pedido;

public interface EmailService {
    void enviarNotaCredito(Pedido pedido);
    void enviarFactura(Pedido pedido);
}
