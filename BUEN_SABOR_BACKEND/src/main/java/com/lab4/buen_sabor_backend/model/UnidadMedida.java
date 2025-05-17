package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnidadMedida extends Master{

    private String denominacion;

    @OneToMany(mappedBy = "unidadMedida")
    @JsonIgnore
    private Set<Articulo> articulos;
}
