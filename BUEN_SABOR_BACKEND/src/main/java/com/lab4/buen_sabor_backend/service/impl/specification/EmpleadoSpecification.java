package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.Empleado;
import org.springframework.data.jpa.domain.Specification;

public class EmpleadoSpecification {

    public static Specification<Empleado> nombreContains(String busqueda) {
        return (root, query, cb) -> {
            if (busqueda == null || busqueda.isBlank()) return null;

            String searchTerm = "%" + busqueda.toLowerCase() + "%";

            return cb.or(
                    // Buscar en nombre
                    cb.like(cb.lower(root.get("nombre")), searchTerm),
                    // Buscar en apellido
                    cb.like(cb.lower(root.get("apellido")), searchTerm),
                    // Buscar en nombre completo (nombre + apellido)
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("nombre"), " "), root.get("apellido"))), searchTerm),
                    // Buscar en apellido + nombre
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("apellido"), " "), root.get("nombre"))), searchTerm),
                    // Buscar en email
                    cb.like(cb.lower(root.get("usuario").get("email")), searchTerm)
            );
        };
    }

    public static Specification<Empleado> emailContains(String email) {
        return (root, query, cb) -> {
            if (email == null || email.isBlank()) return null;
            return cb.like(cb.lower(root.get("usuario").get("email")), "%" + email.toLowerCase() + "%");
        };
    }

    public static Specification<Empleado> rolEquals(String rol) {
        return (root, query, cb) -> {
            if (rol == null || rol.isBlank()) return null;
            return cb.equal(root.get("usuario").get("rol"), rol);
        };
    }

    public static Specification<Empleado> sucursalIdEquals(Long idSucursal) {
        return (root, query, cb) -> {
            if (idSucursal == null) return null;
            return cb.equal(root.get("sucursal").get("id"), idSucursal);
        };
    }

    public static Specification<Empleado> eliminadoEquals(Boolean eliminado) {
        return (root, query, cb) -> {
            // Si eliminado es null, no aplicamos ningún filtro (devuelve todos)
            if (eliminado == null) return null;
            return cb.equal(root.get("eliminado"), eliminado);
        };
    }

    // Métodos adicionales que podrían ser útiles
    public static Specification<Empleado> apellidoContains(String apellido) {
        return (root, query, cb) -> {
            if (apellido == null || apellido.isBlank()) return null;
            return cb.like(cb.lower(root.get("apellido")), "%" + apellido.toLowerCase() + "%");
        };
    }

    public static Specification<Empleado> nombreCompletoContains(String nombreCompleto) {
        return (root, query, cb) -> {
            if (nombreCompleto == null || nombreCompleto.isBlank()) return null;
            String searchTerm = "%" + nombreCompleto.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("nombre"), " "), root.get("apellido"))), searchTerm),
                    cb.like(cb.lower(cb.concat(cb.concat(root.get("apellido"), " "), root.get("nombre"))), searchTerm)
            );
        };
    }

    public static Specification<Empleado> dniEquals(String dni) {
        return (root, query, cb) -> {
            if (dni == null || dni.isBlank()) return null;
            return cb.equal(root.get("dni"), dni);
        };
    }
}