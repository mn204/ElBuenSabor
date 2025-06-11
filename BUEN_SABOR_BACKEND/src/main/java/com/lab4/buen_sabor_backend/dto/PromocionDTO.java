package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromocionDTO extends MasterDTO {
    private String denominacion;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private LocalTime horaDesde;
    private LocalTime horaHasta;
    private String descripcionDescuento;
    private Double precioPromocional;
    private TipoPromocion tipoPromocion;

    private Set<SucursalDTO> sucursales = new HashSet<>();

    private Set<ImagenPromocionDTO> imagenes = new HashSet<>();

    private Set<DetallePromocionDTO> detalles = new HashSet<>();
}
