package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_articulo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Articulo extends Master {

    private String denominacion;
    private Double precioVenta;


    @OneToMany(mappedBy = "articulo", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    private Set<ImagenArticulo> imagenes;

    @ManyToOne
    @JoinColumn(name = "unidad_medida_id")
    private UnidadMedida unidadMedida;

    @OneToMany(mappedBy = "articulo", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private List<DetallePromocion> detallesPromocion = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

}
