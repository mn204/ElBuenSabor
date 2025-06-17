package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.model.Articulo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticuloRepository extends MasterRepository<Articulo, Long> {
    boolean existsById(Long id);
    List<Articulo> findByDenominacionContainingIgnoreCaseAndEliminadoFalse(String denominacion);

}
