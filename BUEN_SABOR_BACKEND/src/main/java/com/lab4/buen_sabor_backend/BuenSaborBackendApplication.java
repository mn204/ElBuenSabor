package com.lab4.buen_sabor_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BuenSaborBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuenSaborBackendApplication.class, args);
    }

}
