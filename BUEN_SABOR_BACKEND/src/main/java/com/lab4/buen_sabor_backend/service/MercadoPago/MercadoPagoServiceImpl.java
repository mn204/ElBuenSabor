package com.lab4.buen_sabor_backend.service.MercadoPago;

import com.lab4.buen_sabor_backend.model.MercadoPago.PreferenceMP;
import com.lab4.buen_sabor_backend.model.Pedido;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MercadoPagoServiceImpl implements MercadoPagoService { // ⚠️ AQUÍ ESTABA EL PROBLEMA

    @Override // ⚠️ Y AGREGAR ESTA ANOTACIÓN
    public PreferenceMP getPreferenciaIdMercadoPago(Pedido pedido) {
        try {
            MercadoPagoConfig.setAccessToken("APP_USR-7115001971388140-050722-baace1bc7839f6490b933b2685a0a38d-2430217802");

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(pedido.getId()))
                    .title("Articulos")
                    .description("Pedido realizado desde el carrito de compras")
                    .quantity(1)
                    .currencyId("ARS")
                    .unitPrice(BigDecimal.valueOf(pedido.getTotal()))
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            PreferenceBackUrlsRequest backURL = PreferenceBackUrlsRequest.builder()
                    .success("https://www.youtube.com/")
                    .pending("http://localhost:5173")
                    .failure("http://localhost:5173")
                    .build();

            System.out.println("Pedido ID: " + pedido.getId());

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .notificationUrl("https://5ab5-2803-9800-9847-7bee-acf8-f71f-8bb-9a75.ngrok-free.app/api/webhook")
                    .externalReference(String.valueOf(pedido.getId()))
                    .items(items)
                    .backUrls(backURL)
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);
            System.out.println(preference.getResponse());

            PreferenceMP mpPreference = new PreferenceMP();
            mpPreference.setStatusCode(preference.getResponse().getStatusCode());
            mpPreference.setId(preference.getId());

            return mpPreference;

        } catch (MPApiException e) {
            var apiResponse = e.getApiResponse();
            var content = apiResponse.getContent();
            System.out.println(content);
            return null;
        } catch (MPException e) {
            throw new RuntimeException(e);
        }
    }
}