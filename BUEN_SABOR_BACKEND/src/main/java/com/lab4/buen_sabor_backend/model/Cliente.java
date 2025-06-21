package com.lab4.buen_sabor_backend.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
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
    private LocalDate fechaNacimiento;



    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    // Cambiar cascade para evitar eliminar domicilios cuando se remueven de la colección
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "cliente_domicilio",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "domicilio_id")
    )
    private Set<Domicilio> domicilios = new HashSet<>();


    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos = new ArrayList<>();
}
