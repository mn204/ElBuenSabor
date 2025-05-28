package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.*;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends Master{

    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private Integer dni;
    private LocalDate fechaNacimiento;

    @Enumerated(EnumType.STRING)
    private Rol rolCliente;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "imagen_cliente_id")
    private ImagenCliente imagenCliente;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_cliente_id")
    private UsuarioCliente usuarioCliente;

    @ManyToMany
    @JoinTable(
            name = "cliente_domicilio",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "domicilio_id")
    )
    private Set<Domicilio> domicilios;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pedido> pedidos = new ArrayList<>();
}
