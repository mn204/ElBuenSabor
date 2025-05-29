package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.lab4.buen_sabor_backend.model.enums.Rol;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Master {
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String firebaseUid;

    @Enumerated(EnumType.STRING)
    private Rol rol; // CLIENTE, ADMINISTRADOR, COCINERO, etc.

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Cliente cliente;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Empleado empleado;
}
