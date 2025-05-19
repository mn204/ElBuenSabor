package com.lab4.buen_sabor_backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_domicilio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = DomicilioDepartamento.class, name = "departamento"),
        @JsonSubTypes.Type(value = DomicilioCasa.class, name = "casa")
})
public abstract class Domicilio extends Master{

    private String calle;
    private Integer numero;
    private Integer codigoPostal;

    @ManyToOne
    @JoinColumn(name = "localidad_id")
    private Localidad localidad;
}