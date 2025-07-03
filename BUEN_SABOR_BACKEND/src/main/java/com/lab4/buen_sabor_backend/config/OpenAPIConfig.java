package com.lab4.buen_sabor_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;

public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Buen Sabor")
                        .version("1.0")
                        .description("API para la gestión de productos, pedidos, promociones, etc.")
                        .contact(new Contact().name("Buen Sabor").email("buensaborprueba@gmail.com")));
    }
}
