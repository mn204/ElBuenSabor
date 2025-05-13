package com.lab4.buen_sabor_backend.WebConfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/img/**") // Cuando pidan /img/...
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/"); // Buscalo en uploads/
    }
}
