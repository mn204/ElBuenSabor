package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEmpleado extends Master{

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String firebaseUid;
}