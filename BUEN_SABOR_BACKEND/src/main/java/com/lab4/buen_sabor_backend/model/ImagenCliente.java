package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenCliente extends Master{

    private String denominacion;
}