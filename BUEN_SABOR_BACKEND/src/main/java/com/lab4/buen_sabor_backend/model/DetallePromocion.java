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
public class DetallePromocion extends Master {

    private Integer cantidad;

    @ManyToOne
    @JoinColumn(name = "promocion_id")
    @JsonIgnore
    private Promocion promocion;

    @ManyToOne
    @JoinColumn(name = "articulo_id")
    private Articulo articulo;
}

