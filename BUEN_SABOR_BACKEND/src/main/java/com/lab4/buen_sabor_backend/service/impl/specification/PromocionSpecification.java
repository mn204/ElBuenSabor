package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.*;

public class PromocionSpecification {

    public static Specification<Promocion> filtrar(
            String denominacion,
            TipoPromocion tipoPromocion,
            Boolean activa,
            Boolean eliminado,
            Long idSucursal,
            OffsetDateTime fechaHoraDesde,
            OffsetDateTime fechaHoraHasta,
            Double precioMin,
            Double precioMax
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (denominacion != null && !denominacion.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("denominacion")), "%" + denominacion.toLowerCase() + "%"));
            }

            if (tipoPromocion != null) {
                predicates.add(cb.equal(root.get("tipoPromocion"), tipoPromocion));
            }

            if (activa != null) {
                predicates.add(cb.equal(root.get("activa"), activa));
            }

            if (eliminado != null) {
                predicates.add(cb.equal(root.get("eliminado"), eliminado));
            }

            if (idSucursal != null) {
                // Join con sucursales y filtra por id
                predicates.add(cb.equal(root.join("sucursales").get("id"), idSucursal));
            }

            if (precioMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("precioPromocional"), precioMin));
            }

            if (precioMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("precioPromocional"), precioMax));
            }

            // Fecha + hora combinadas
            if (fechaHoraDesde != null && fechaHoraHasta != null) {
                LocalDateTime desdeLdt = fechaHoraDesde.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
                LocalDateTime hastaLdt = fechaHoraHasta.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();

                Expression<LocalDateTime> inicioPromocion = cb.function(
                        "TIMESTAMP", LocalDateTime.class,
                        root.get("fechaDesde"),
                        root.get("horaDesde")
                );

                Expression<LocalDateTime> finPromocion = cb.function(
                        "TIMESTAMP", LocalDateTime.class,
                        root.get("fechaHasta"),
                        root.get("horaHasta")
                );

                predicates.add(cb.greaterThanOrEqualTo(inicioPromocion, desdeLdt));
                predicates.add(cb.lessThanOrEqualTo(finPromocion, hastaLdt));
            } else if (fechaHoraDesde != null) {
                LocalDateTime desdeLdt = fechaHoraDesde.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
                Expression<LocalDateTime> inicioPromocion = cb.function(
                        "TIMESTAMP", LocalDateTime.class,
                        root.get("fechaDesde"),
                        root.get("horaDesde")
                );
                predicates.add(cb.greaterThanOrEqualTo(inicioPromocion, desdeLdt));
            } else if (fechaHoraHasta != null) {
                LocalDateTime hastaLdt = fechaHoraHasta.withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
                Expression<LocalDateTime> finPromocion = cb.function(
                        "TIMESTAMP", LocalDateTime.class,
                        root.get("fechaHasta"),
                        root.get("horaHasta")
                );
                predicates.add(cb.lessThanOrEqualTo(finPromocion, hastaLdt));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
