package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.service.PedidoService;
import com.mercadopago.client.merchantorder.MerchantOrderClient;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.net.HttpStatus;
import com.mercadopago.resources.merchantorder.MerchantOrder;
import com.mercadopago.resources.payment.Payment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/webhook")
@CrossOrigin(origins = "*")
public class MercadoPagoController {
    private final PedidoService pedidoService;

    public MercadoPagoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> body) {
        System.out.println("Webhook recibido: " + body);

        String tipo = (String) body.get("type");
        if (!"payment".equals(tipo)) return ResponseEntity.ok("No es un pago");

        Map<String, Object> data = (Map<String, Object>) body.get("data");
        Long paymentId = Long.valueOf(data.get("id").toString());

        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(paymentId);

            MerchantOrderClient merchantOrderClient = new MerchantOrderClient();
            MerchantOrder order = merchantOrderClient.get(payment.getOrder().getId());

            String externalReference = order.getExternalReference();
            Long pedidoId = Long.valueOf(externalReference);

            String paymentStatus = payment.getStatus();
            System.out.printf("Pago ID: %d, Pedido ID: %d, Estado: %s%n", paymentId, pedidoId, paymentStatus);

            // 👉 Llamado al service
            pedidoService.actualizarEstadoPorPago(pedidoId, true);

        } catch (MPApiException | MPException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el pago");
        }

        return ResponseEntity.ok("OK");
    }
}
