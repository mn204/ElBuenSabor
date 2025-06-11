package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagenArticulo extends Master{
    @Lob
    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "articulo_id")
    @JsonBackReference
    @JsonIgnore
    private Articulo articulo;
}
