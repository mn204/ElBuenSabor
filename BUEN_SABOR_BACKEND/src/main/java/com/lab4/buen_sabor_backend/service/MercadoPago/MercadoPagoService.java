package com.lab4.buen_sabor_backend.service.MercadoPago;

import com.lab4.buen_sabor_backend.model.MercadoPago.PreferenceMP;
import com.lab4.buen_sabor_backend.model.Pedido;

public interface MercadoPagoService {
    PreferenceMP getPreferenciaIdMercadoPago(Pedido pedido);
}
