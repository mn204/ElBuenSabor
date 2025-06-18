package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.Cliente;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class ClienteSpecification {

    public static Specification<Cliente> nombreContains(String busqueda) {
        return (root, query, cb) -> {
            if (busqueda == null || busqueda.isBlank()) return null;

            String searchTerm = "%" + busqueda.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("nombre")), searchTerm),
                    cb.like(cb.lower(root.get("apellido")), searchTerm),
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("nombre"), " "), root.get("apellido"))), searchTerm),
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("apellido"), " "), root.get("nombre"))), searchTerm),
                    cb.like(cb.lower(root.get("usuario").get("email")), searchTerm)
            );
        };
    }

    public static Specification<Cliente> emailContains(String email) {
        return (root, query, cb) -> {
            if (email == null || email.isBlank()) return null;
            return cb.like(cb.lower(root.get("usuario").get("email")), "%" + email.toLowerCase() + "%");
        };
    }

    public static Specification<Cliente> eliminadoEquals(Boolean eliminado) {
        return (root, query, cb) -> {
            if (eliminado == null) return null;
            return cb.equal(root.get("eliminado"), eliminado);
        };
    }

    // Métodos adicionales que podrían ser útiles
    public static Specification<Cliente> apellidoContains(String apellido) {
        return (root, query, cb) -> {
            if (apellido == null || apellido.isBlank()) return null;
            return cb.like(cb.lower(root.get("apellido")), "%" + apellido.toLowerCase() + "%");
        };
    }

    public static Specification<Cliente> nombreCompletoContains(String nombreCompleto) {
        return (root, query, cb) -> {
            if (nombreCompleto == null || nombreCompleto.isBlank()) return null;
            String searchTerm = "%" + nombreCompleto.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("nombre"), " "), root.get("apellido"))), searchTerm),
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("apellido"), " "), root.get("nombre"))), searchTerm)
            );
        };
    }

    public static Specification<Cliente> dniEquals(String dni) {
        return (root, query, cb) -> {
            if (dni == null || dni.isBlank()) return null;
            return cb.equal(root.get("usuario").get("dni"), dni);
        };
    }

    public static Specification<Cliente> telefonoContains(String telefono) {
        return (root, query, cb) -> {
            if (telefono == null || telefono.isBlank()) return null;
            return cb.like(cb.lower(root.get("telefono")), "%" + telefono.toLowerCase() + "%");
        };
    }
}