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
    List<Promocion> findByNombreContainingIgnoreCase(String nombre);

    // Buscar promociones activas (fecha actual entre fechaInicio y fechaFin)
    @Query("SELECT p FROM Promocion p WHERE :fechaActual BETWEEN p.fechaInicio AND p.fechaFin")
    List<Promocion> findPromocionesActivas(@Param("fechaActual") LocalDate fechaActual);

    @Query("SELECT new com.lab4.buen_sabor_backend.dto.PromocionDTO(p.id, p.nombre, p.descripcion, p.fechaInicio, p.fechaFin) FROM Promocion p")
    List<PromocionDTO> findAllDTO();

     */
}