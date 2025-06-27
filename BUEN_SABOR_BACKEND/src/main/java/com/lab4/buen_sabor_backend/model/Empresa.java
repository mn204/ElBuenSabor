package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empresa extends Master {

    private String nombre;
    private String razonSocial;
    private Long cuil;

    @OneToMany(mappedBy = "empresa", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    private Set<Sucursal> sucursales;
}
