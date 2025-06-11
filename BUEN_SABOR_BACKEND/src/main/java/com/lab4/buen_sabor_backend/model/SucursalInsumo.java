package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SucursalInsumo extends Master {

    private Integer stockMinimo;
    private Integer stockActual;
    private Integer stockMaximo;

    @ManyToOne
    @JoinColumn(name = "sucursal_id")
    @JsonIgnore
    private Sucursal sucursal;


    @OneToMany(mappedBy = "sucursalInsumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ArticuloInsumo> articulosInsumo = new HashSet<>();
}