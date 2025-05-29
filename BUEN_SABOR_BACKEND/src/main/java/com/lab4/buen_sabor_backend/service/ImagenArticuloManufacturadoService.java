package com.lab4.buen_sabor_backend.service;

import com.lab4.buen_sabor_backend.model.ImagenArticuloManufacturado;

import java.util.List;

public interface ImagenArticuloManufacturadoService extends MasterService<ImagenArticuloManufacturado, Long> {
    List<ImagenArticuloManufacturado> findAllByProductoId(Long productoId);
}