package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.PromocionDTO;
import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface PromocionRepository extends MasterRepository<Promocion, Long>, JpaSpecificationExecutor<Promocion> {
    /*
    @Query("SELECT p FROM Promocion p WHERE :fechaActual BETWEEN p.fechaInicio AND p.fechaFin")
    List<Promocion> findPromocionesActivas(@Param("fechaActual") LocalDate fechaActual);
    */

    boolean existsById(Long id);

    @Query("""
        SELECT DISTINCT p FROM Promocion p
        JOIN p.sucursales s
        WHERE s = :sucursal
        AND p.eliminado = false
        AND p.activa = true
        AND NOT EXISTS (
            SELECT 1 FROM DetallePromocion pd
            JOIN pd.articulo a
            WHERE pd.promocion = p
            AND a.eliminado = true
        )
        """)
    List<Promocion> findPromocionesActivasPorSucursalConArticulosNoEliminados(@Param("sucursal") Sucursal sucursal);
    boolean existsByDenominacion(String denominacion);

    @Query("SELECT p FROM Promocion p JOIN p.detalles d WHERE d.articulo.id = :id")
    List<Promocion> findByDetallesArticuloId(Long id);

    boolean existsByDenominacionAndIdNot(String denominacion, Long id);
}