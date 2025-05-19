package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenArticuloManufacturado extends Master {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "articulo_manufacturado_id")
    @JsonIgnore
    private ArticuloManufacturado articuloManufacturado;
}

