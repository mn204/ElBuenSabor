package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ArticuloInsumoSpecification {

    public static Specification<ArticuloInsumo> filtrar(String denominacion,
                                                        Set<Long> categoriaIds,
                                                        Long unidadMedidaId,
                                                        Boolean eliminado,
                                                        Double precioCompraMin,
                                                        Double precioCompraMax,
                                                        Double precioVentaMin,
                                                        Double precioVentaMax) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (denominacion != null && !denominacion.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("denominacion")), "%" + denominacion.toLowerCase() + "%"));
            }

            if (categoriaIds != null && !categoriaIds.isEmpty()) {
                predicates.add(root.get("categoria").get("id").in(categoriaIds));
            }

            if (unidadMedidaId != null) {
                predicates.add(cb.equal(root.get("unidadMedida").get("id"), unidadMedidaId));
            }

            if (eliminado != null) {
                predicates.add(cb.equal(root.get("eliminado"), eliminado));
            }

            if (precioCompraMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("precioCompra"), precioCompraMin));
            }

            if (precioCompraMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("precioCompra"), precioCompraMax));
            }

            if (precioVentaMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("precioVenta"), precioVentaMin));
            }

            if (precioVentaMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("precioVenta"), precioVentaMax));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
