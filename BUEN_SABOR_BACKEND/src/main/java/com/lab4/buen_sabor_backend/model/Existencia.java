package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

import java.time.LocalDate;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Existencia extends Master {

    private LocalDate fechaCompra;
    private LocalDate fechaVencimiento;
    private Integer cantidad;

    @ManyToOne
    @JoinColumn(name = "sucursal_insumo_id")
    @JsonIgnore
    private SucursalInsumo sucursalInsumo;
}
