package com.lab4.buen_sabor_backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_articulo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = ArticuloInsumo.class, name = "insumo"),
        @JsonSubTypes.Type(value = ArticuloManufacturado.class, name = "manufacturado")
})
public abstract class Articulo extends Master {

    private String denominacion;
    private Double precioVenta;

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HistoricoPrecioVenta> historicosPrecioVenta;

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HistoricoPrecioCompra> historicosPrecioCompra;

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ImagenArticulo> imagenes;

    @ManyToOne
    @JoinColumn(name = "unidad_medida_id")
    private UnidadMedida unidadMedida;

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<DetallePromocion> detallesPromocion = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @JsonIgnore
    private Categoria categoria;

}
