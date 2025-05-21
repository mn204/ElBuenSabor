package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Domicilio extends Master{

    private String calle;
    private Integer numero;
    private Integer codigoPostal;
    private String piso;
    private String nroDepartamento;
    private String detalles;

    @ManyToOne
    @JoinColumn(name = "localidad_id")
    private Localidad localidad;
}