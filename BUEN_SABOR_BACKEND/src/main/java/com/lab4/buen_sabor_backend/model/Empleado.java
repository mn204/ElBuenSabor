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
    private String email;
    private LocalDate fechaNacimiento;
    private Integer dni;


    // Relación 1:1 con ImagenEmpleado
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "imagen_empleado_id")
    private ImagenEmpleado imagenEmpleado;

    // Relación 1:1 con UsuarioEmpleado
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Relación ManyToOne con Domicilio
    @ManyToOne
    @JoinColumn(name = "domicilio_id")
    private Domicilio domicilio;

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pedido> pedidos = new ArrayList<>();
}
