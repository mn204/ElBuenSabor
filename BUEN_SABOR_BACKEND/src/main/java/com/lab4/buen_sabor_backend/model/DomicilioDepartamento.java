package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DomicilioDepartamento extends Domicilio {

    private String piso;
    private String nroDepartamento;
}
