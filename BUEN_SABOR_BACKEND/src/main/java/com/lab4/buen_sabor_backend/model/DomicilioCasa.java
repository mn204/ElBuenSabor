package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DomicilioCasa extends Domicilio {

    private String detalles;
}
