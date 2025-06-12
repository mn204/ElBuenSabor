package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagenPromocion extends Master {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "promocion_id")
    private Promocion promocion;
}
