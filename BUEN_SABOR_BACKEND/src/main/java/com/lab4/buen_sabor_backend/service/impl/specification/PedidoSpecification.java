package com.lab4.buen_sabor_backend.service.impl.specification;

import com.lab4.buen_sabor_backend.model.Pedido;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public class PedidoSpecification {

    public static Specification<Pedido> clienteIdEquals(Long clienteId) {
        return (root, query, cb) -> cb.equal(root.get("cliente").get("id"), clienteId);
    }

    public static Specification<Pedido> clienteNombreContains(String nombreCliente) {
        return (root, query, cb) -> {
            if (nombreCliente == null || nombreCliente.isBlank()) return null;
            return cb.like(cb.lower(root.get("cliente").get("nombre")), "%" + nombreCliente.toLowerCase() + "%");
        };
    }

    public static Specification<Pedido> idEquals(Long idPedido) {
        return (root, query, cb) -> idPedido == null ? null : cb.equal(root.get("id"), idPedido);
    }

    public static Specification<Pedido> sucursalIdEquals(Long idSucursal) {
        return (root, query, cb) -> idSucursal == null ? null : cb.equal(root.get("sucursal").get("id"), idSucursal);
    }
    public static Specification<Pedido> empleadoIdEquals(Long empleadoId) {
        return (root, query, cb) -> empleadoId == null ? null : cb.equal(root.get("empleado").get("id"), empleadoId);
    }
    public static Specification<Pedido> pagadoEquals(Boolean pagado) {
        return (root, query, cb) -> pagado == null ? null : cb.equal(root.get("pagado"), pagado);
    }
    public static Specification<Pedido> sucursalNombreContains(String sucursalNombre) {
        return (root, query, cb) -> {
            if (sucursalNombre == null || sucursalNombre.isBlank()) return null;
            return cb.like(cb.lower(root.get("sucursal").get("nombre")), "%" + sucursalNombre.toLowerCase() + "%");
        };
    }

    public static Specification<Pedido> estadoEquals(Estado estado) {
        return (root, query, cb) -> estado == null ? null : cb.equal(root.get("estado"), estado);
    }

    public static Specification<Pedido> estadoIn(List<Estado> estados) {
        return (root, query, builder) ->
                estados == null || estados.isEmpty() ? null : root.get("estado").in(estados);
    }

    public static Specification<Pedido> tipoEnvioEquals(TipoEnvio tipoEnvio) {
        return (root, query, builder) ->
                tipoEnvio == null ? null : builder.equal(root.get("tipoEnvio"), tipoEnvio);
    }

    public static Specification<Pedido> fechaBetween(OffsetDateTime desde, OffsetDateTime hasta) {
        return (root, query, cb) -> {
            if (desde == null && hasta == null) return null;
            if (desde != null && hasta != null)
                return cb.between(root.get("fechaPedido"), desde.toLocalDateTime(), hasta.toLocalDateTime());
            if (desde != null)
                return cb.greaterThanOrEqualTo(root.get("fechaPedido"), desde.toLocalDateTime());
            return cb.lessThanOrEqualTo(root.get("fechaPedido"), hasta.toLocalDateTime());
        };
    }

    public static Specification<Pedido> contieneArticulo(String nombreArticulo) {
        return (root, query, cb) -> {
            if (nombreArticulo == null || nombreArticulo.isBlank()) return null;
            Join<Pedido, DetallePedido> detalles = root.join("detalles");
            Join<DetallePedido, Articulo> articulo = detalles.join("articulo");
            query.distinct(true);
            return cb.like(cb.lower(articulo.get("denominacion")), "%" + nombreArticulo.toLowerCase() + "%");
        };
    }
}
