package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import com.lab4.buen_sabor_backend.model.ImagenArticuloManufacturado;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenArticuloManufacturadoRepository extends MasterRepository<ImagenArticuloManufacturado, Long> {
    List<ImagenArticuloManufacturado> findAllByArticuloManufacturadoId(Long categoriaId);
}