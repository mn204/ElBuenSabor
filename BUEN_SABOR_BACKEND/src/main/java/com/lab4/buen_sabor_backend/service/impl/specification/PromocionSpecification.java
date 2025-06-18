package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class PromocionSpecification {

    public static Specification<Promocion> conSucursal(Long idSucursal) {
        return (root, query, cb) -> idSucursal == null ? null :
                cb.equal(root.join("sucursales").get("id"), idSucursal);
    }

    public static Specification<Promocion> conActiva(Boolean activa) {
        return (root, query, cb) -> activa == null ? null :
                cb.equal(root.get("activa"), activa);
    }

    public static Specification<Promocion> conTipo(TipoPromocion tipo) {
        return (root, query, cb) -> tipo == null ? null :
                cb.equal(root.get("tipoPromocion"), tipo);
    }

    public static Specification<Promocion> desdeFecha(LocalDate fecha) {
        return (root, query, cb) -> fecha == null ? null :
                cb.greaterThanOrEqualTo(root.get("fechaDesde"), fecha);
    }

    public static Specification<Promocion> hastaFecha(LocalDate fecha) {
        return (root, query, cb) -> fecha == null ? null :
                cb.lessThanOrEqualTo(root.get("fechaHasta"), fecha);
    }
}
