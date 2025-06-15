package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.repository.ArticuloManufacturadoRepository;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticuloManufacturadoServiceImpl extends MasterServiceImpl<ArticuloManufacturado, Long>
        implements ArticuloManufacturadoService {

    private static final Logger logger = LoggerFactory.getLogger(ArticuloManufacturadoServiceImpl.class);
    private final ArticuloManufacturadoRepository articuloManufacturadoRepository;

    @Autowired
    public ArticuloManufacturadoServiceImpl(ArticuloManufacturadoRepository articuloManufacturadoRepository) {
        super(articuloManufacturadoRepository);
        this.articuloManufacturadoRepository = articuloManufacturadoRepository;
    }

    @Override
    @Transactional
    public ArticuloManufacturado save(ArticuloManufacturado entity) {
        // Validaciones antes de guardar
        validarDatosBasicos(entity);
        validarIngredientes(entity);
        for(DetalleArticuloManufacturado detalle : entity.getDetalles()) {
            detalle.setArticuloManufacturado(entity);
        }

        for(ImagenArticulo imagen: entity.getImagenes()) {
            imagen.setArticulo(entity);
        }

        // Verificar duplicados
        if (existeByDenominacion(entity.getDenominacion())) {
            throw new IllegalArgumentException("Ya existe un producto con la denominación: " + entity.getDenominacion());
        }


        logger.info("Guardando ArticuloManufacturado: {}", entity.getDenominacion());
        return super.save(entity);
    }

    @Override
    @Transactional
    public ArticuloManufacturado update(Long id, ArticuloManufacturado entity) {
        // Validaciones antes de actualizar
        validarDatosBasicos(entity);
        validarIngredientes(entity);
        System.out.println(entity.getDetalles());
        System.out.println(entity);
        // Verificar duplicados excluyendo el ID actual
        if (existeByDenominacionExcluyendoId(entity.getDenominacion(), id)) {
            throw new IllegalArgumentException("Ya existe un producto con la denominación: " + entity.getDenominacion());
        }

        for(DetalleArticuloManufacturado detalle : entity.getDetalles()) {
            System.out.println(detalle.getArticuloInsumo().getDenominacion());
            detalle.setArticuloManufacturado(entity);
        }

        for(ImagenArticulo imagen : entity.getImagenes()) {
            imagen.setArticulo(entity);
        }
        logger.info("Actualizando ArticuloManufacturado con ID: {}", id);
        return super.update(id, entity);
    }

    @Override
    public List<ArticuloManufacturado> findByDenominacion(String denominacion) {
        logger.info("Buscando productos por denominación: {}", denominacion);
        return articuloManufacturadoRepository.findByDenominacionContainingIgnoreCaseAndEliminadoFalse(denominacion);
    }

    @Override
    public List<ArticuloManufacturado> findByCategoria(Long categoriaId) {
        logger.info("Buscando productos por categoría ID: {}", categoriaId);
        return articuloManufacturadoRepository.findByCategoriaIdAndEliminadoFalse(categoriaId);
    }

    @Override
    public List<ArticuloManufacturado> findByRangoPrecio(Double precioMin, Double precioMax) {
        logger.info("Buscando productos por rango de precio: {} - {}", precioMin, precioMax);
        return articuloManufacturadoRepository.findByPrecioVentaBetweenAndEliminadoFalse(precioMin, precioMax);
    }

    @Override
    public List<ArticuloManufacturado> findByTiempoMaximo(Integer tiempoMaximo) {
        logger.info("Buscando productos por tiempo máximo: {} minutos", tiempoMaximo);
        return articuloManufacturadoRepository.findByTiempoEstimadoMinutosLessThanEqualAndEliminadoFalse(tiempoMaximo);
    }

    @Override
    public List<ArticuloManufacturado> findAll() {
        logger.info("Buscando productos");
        return articuloManufacturadoRepository.findAll();
    }

    @Override
    public List<ArticuloManufacturado> findAllWithIngredientes() {
        logger.info("Obteniendo todos los productos con ingredientes");
        return articuloManufacturadoRepository.findAllWithIngredientes();
    }

    @Override
    public List<ArticuloManufacturado> findByCategoriaWithIngredientes(Long categoriaId) {
        logger.info("Obteniendo productos por categoría {} con ingredientes", categoriaId);
        return articuloManufacturadoRepository.findByCategoriaWithIngredientes(categoriaId);
    }

    @Override
    public Page<ArticuloManufacturado> findActivosOrdenados(Pageable pageable) {
        logger.info("Obteniendo productos activos ordenados con paginación");
        return articuloManufacturadoRepository.findByEliminadoFalseOrderByDenominacionAsc(pageable);
    }

    @Override
    public void validarIngredientes(ArticuloManufacturado producto) {
        if (producto.getDetalles() == null || producto.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("El producto debe tener al menos un ingrediente");
        }

        // Validar que todos los ingredientes tengan cantidad válida
        for (DetalleArticuloManufacturado detalle : producto.getDetalles()) {
            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad de cada ingrediente debe ser mayor a 0");
            }
            if (detalle.getArticuloInsumo() == null) {
                throw new IllegalArgumentException("Todos los detalles deben tener un artículo insumo válido");
            }
        }
    }

    @Override
    public Double calcularCostoTotal(ArticuloManufacturado producto) {
        if (producto.getDetalles() == null || producto.getDetalles().isEmpty()) {
            return 0.0;
        }

        return producto.getDetalles().stream()
                .mapToDouble(detalle -> {
                    Double cantidad = detalle.getCantidad() != null ? detalle.getCantidad() : 0.0;
                    Double precio = detalle.getArticuloInsumo() != null &&
                            detalle.getArticuloInsumo().getPrecioCompra() != null ?
                            detalle.getArticuloInsumo().getPrecioCompra() : 0.0;
                    return cantidad * precio;
                })
                .sum();
    }

    @Override
    public boolean existeByDenominacion(String denominacion) {
        return articuloManufacturadoRepository.existsByDenominacionIgnoreCaseAndEliminadoFalse(denominacion);
    }

    @Override
    public boolean existeByDenominacionExcluyendoId(String denominacion, Long id) {
        return articuloManufacturadoRepository.existsByDenominacionIgnoreCaseAndEliminadoFalseAndIdNot(denominacion, id);
    }

    @Override
    public List<ArticuloManufacturado> findManufacturadosConStockDisponiblePorSucursal(int sucursalId) {
        logger.info("Buscando productos con stock disponible en sucursal ID: {}", sucursalId);
        return articuloManufacturadoRepository.findManufacturadosConStockDisponiblePorSucursal(sucursalId);
    }


    private void validarDatosBasicos(ArticuloManufacturado producto) {
        if (producto.getDenominacion() == null || producto.getDenominacion().trim().isEmpty()) {
            throw new IllegalArgumentException("La denominación del producto es obligatoria");
        }

        if (producto.getPrecioVenta() == null || producto.getPrecioVenta() <= 0) {
            throw new IllegalArgumentException("El precio de venta debe ser mayor a 0");
        }

        if (producto.getTiempoEstimadoMinutos() == null || producto.getTiempoEstimadoMinutos() <= 0) {
            throw new IllegalArgumentException("El tiempo estimado debe ser mayor a 0 minutos");
        }

        if (producto.getCategoria() == null) {
            throw new IllegalArgumentException("La categoría del producto es obligatoria");
        }

        if (producto.getUnidadMedida() == null) {
            throw new IllegalArgumentException("La unidad de medida del producto es obligatoria");
        }
    }
}