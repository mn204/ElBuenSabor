package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;


import java.util.ArrayList;
import java.util.List;

public class ArticuloManufacturadoSpecification {

    public static Specification<ArticuloManufacturado> filtrar(String denominacion, List<Long> categoriaIds, Boolean eliminado, Double precioMin, Double precioMax) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (denominacion != null && !denominacion.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("denominacion")), "%" + denominacion.toLowerCase() + "%"));
            }

            if (categoriaIds != null && !categoriaIds.isEmpty()) {
                predicates.add(root.get("categoria").get("id").in(categoriaIds));
            }

            if (eliminado != null) {
                predicates.add(cb.equal(root.get("eliminado"), eliminado));
            }

            if (precioMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("precioVenta"), precioMin));
            }

            if (precioMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("precioVenta"), precioMax));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
