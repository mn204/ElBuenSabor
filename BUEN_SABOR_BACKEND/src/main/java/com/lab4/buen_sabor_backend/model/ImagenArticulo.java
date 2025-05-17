package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenArticulo extends Master{

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "articulo_id")
    private Articulo articulo;
}
