package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

import java.time.LocalTime;
import java.util.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Sucursal extends Master {

    private String nombre;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private Boolean casaMatriz;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    @JsonBackReference
    private Empresa empresa;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "domicilio_id")
    private Domicilio domicilio;

    @OneToMany(mappedBy = "sucursal")
    private Set<Pedido> pedidos = new HashSet<>();

    @ManyToMany(mappedBy = "sucursales")
    private Set<Promocion> promociones = new HashSet<>();
}
