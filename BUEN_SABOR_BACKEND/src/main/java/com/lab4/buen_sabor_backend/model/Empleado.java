package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.*;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Empleado extends Master{

    private String nombre;
    private String apellido;
    private String telefono;
    private LocalDate fechaNacimiento;


    // Relación 1:1 con UsuarioEmpleado
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    // Relación ManyToOne con Domicilio
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "domicilio_id")
    private Domicilio domicilio;

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "sucursal_id")
    private Sucursal sucursal;
}
