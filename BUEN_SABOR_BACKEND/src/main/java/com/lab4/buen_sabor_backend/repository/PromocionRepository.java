package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.PromocionDTO;
import com.lab4.buen_sabor_backend.model.Promocion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromocionRepository extends MasterRepository<Promocion, Long> {
    /*
    @Query("SELECT p FROM Promocion p WHERE :fechaActual BETWEEN p.fechaInicio AND p.fechaFin")
    List<Promocion> findPromocionesActivas(@Param("fechaActual") LocalDate fechaActual);
    */
    boolean existsById(Long id);

    boolean existsByDenominacion(String denominacion);
    boolean existsByDenominacionAndIdNot(String denominacion, Long id);
}