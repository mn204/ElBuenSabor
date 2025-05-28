package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoPrecioVenta extends Master{

    private Double precio;
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "articulo_id")
    private Articulo articulo;
}

