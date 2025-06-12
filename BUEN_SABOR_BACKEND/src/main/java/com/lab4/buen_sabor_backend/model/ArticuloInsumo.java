package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("Insumo")
public class ArticuloInsumo extends Articulo {

    private Double precioCompra;
    private Boolean esParaElaborar;

    @ManyToOne
    @JoinColumn(name = "sucursal_insumo_id")
    private SucursalInsumo sucursalInsumo;
}

